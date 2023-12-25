import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  const { email, password, username, fullName } = req.body;

  // some tests if atleast one of field pass the condition
  if (
    [fullName, email, password, username].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // check if user with email or username already exists
  const existedUser = await User.findOne({ $or: [{ email }, { username }] });

  if (existedUser) {
    throw new ApiError(409, "Email or username already taken");
  }

  // get avatar and cover image that is uploaded by multer
  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath, "avatar");
  const coverImage = await uploadOnCloudinary(coverImageLocalPath, "cover");

  if (!avatar) {
    throw new ApiError(400, "Error while uploading avatar");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Error while registering user");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(200, createdUser, "User has been registered sucessfully")
    );
});

export { registerUser };
