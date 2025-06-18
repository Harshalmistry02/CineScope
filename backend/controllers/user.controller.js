import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { User } from "../models/user.model.js";


const generateAccessAndRefreshToken = async (userid) => {

    try {
        const user = await User.findById(userid);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError('500', "Something went wrong while genrate access and refresh token! ")
    }
}


const registerUser = asyncHandler(async (req, res) => {

    const { username, email, password } = req.body;

    if ([username, email, password].some(field => !field || field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new ApiError(409, "User with this username or email already exists!");
    }

    const user = await User.create({
        username: username.trim(),
        email: email.trim(),
        password
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, createdUser, "User registered successfully"));
});


const loginUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    // Validation
    if (!username && !email) {
        throw new ApiError(400, "Username or email is required");
    }

    if (!password) {
        throw new ApiError(400, "Password is required");
    }

    // Find user
    const user = await User.findOne({
        $or: [{ username }, { email }]
    }).select("+password +refreshToken"); // Include password and refreshToken fields

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    // Password verification
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    // Token generation
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    // Get user without sensitive fields
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    // Cookie options
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };

    // Set cookies and send response
    return res
        .status(200)
        .cookie("accessToken", accessToken, {
            ...cookieOptions,
            maxAge: 15 * 60 * 1000 // 15 minutes for access token
        })
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "User logged in successfully"
            )
        );
});


const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"))
})



const refreshAccessToken = asyncHandler(async (req, res) => {
    // 1. Get refresh token from cookies or body
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request: No refresh token provided");
    }

    try {
        // 2. Verify the refresh token
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        // 3. Find the user
        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, "Invalid refresh token: User not found");
        }

        // 4. Check if refresh token matches
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        // 5. Generate new tokens
        const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id);

        // 6. Set cookie options
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        };

        // 7. Update user's refresh token in database
        user.refreshToken = newRefreshToken;
        await user.save({ validateBeforeSave: false });

        // 8. Send response with cookies
        return res
            .status(200)
            .cookie("accessToken", accessToken, { 
                ...cookieOptions,
                maxAge: 15 * 60 * 1000 // 15 minutes for access token
            })
            .cookie("refreshToken", newRefreshToken, cookieOptions)
            .json(
                new ApiResponse(
                    200,
                    { 
                        accessToken, 
                        refreshToken: newRefreshToken 
                    },
                    "Access token refreshed successfully"
                )
            );
    } catch (error) {
        // Handle specific JWT errors
        if (error.name === 'TokenExpiredError') {
            throw new ApiError(401, "Refresh token expired");
        }
        if (error.name === 'JsonWebTokenError') {
            throw new ApiError(401, "Invalid refresh token");
        }
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});

// Helper function
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        
        const accessToken = user.generateAccessToken();
        const newRefreshToken = user.generateRefreshToken();
        
        return { accessToken, newRefreshToken };
    } catch (error) {
        throw new ApiError(500, "Error generating tokens");
    }
};

const changeCurrentPassword = asyncHandler(async (req, res) => {

    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid Old password!")
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"))
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            req.user,
            "User fetched successfully"
        ))
})


const updateAccountDetails = asyncHandler(async (req, res) => {
    const { username, email } = req.body

    if (!username || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                username,
                email
            }
        },
        { new: true }

    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Account details updated successfully"))
});


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails
}