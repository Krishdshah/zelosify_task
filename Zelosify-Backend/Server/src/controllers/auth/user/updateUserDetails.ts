import prisma from "../../../config/prisma/prisma.js";
import { ApiResponse, AuthenticatedRequest } from "../../../types/common.js";

export const updateUserDetails = async (
  req: AuthenticatedRequest,
  res: ApiResponse
) => {
  try {
    const userId = req.user?.id;
    const { firstName, lastName, phoneNumber, department } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        phoneNumber,
        department,
        profileComplete: true,
      },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        department: true,
        tenant: {
          select: {
            tenantId: true,
            companyName: true,
          },
        },
      },
    });

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("Error during user update:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
