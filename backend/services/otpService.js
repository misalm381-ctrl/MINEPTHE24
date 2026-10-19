function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function createOTP() {
    const otp = generateOTP();

    console.log("=================================");
    console.log("       MINEPTHE VERIFICATION OTP");
    console.log("       Code: ", otp);
    console.log("=================================");

    return {
        otp: otp,
        expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes validity
    };
}

function verifyOTP(enteredOTP, savedOTP, expiresAt) {
    if (!savedOTP) {
        return {
            success: false,
            message: "OTP was not generated."
        };
    }

    if (Date.now() > expiresAt) {
        return {
            success: false,
            message: "OTP has expired. Please request a new one."
        };
    }

    if (enteredOTP !== savedOTP) {
        return {
            success: false,
            message: "Invalid OTP code. Please try again."
        };
    }

    return {
        success: true,
        message: "Phone verification successful!"
    };
}

module.exports = {
    createOTP,
    verifyOTP
};
