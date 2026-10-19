function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function createOTP() {
    const otp = generateOTP();

    console.log("=================================");
    console.log("MINEPTHE DEMO OTP");
    console.log("Generated OTP:", otp);
    console.log("=================================");

    return {
        otp: otp,
        expiresAt: Date.now() + 10 * 60 * 1000
    };
}

function verifyOTP(enteredOTP, savedOTP, expiresAt) {

    if (!savedOTP) {
        return {
            success: false,
            message: "Demo OTP was not generated."
        };
    }

    if (Date.now() > expiresAt) {
        return {
            success: false,
            message: "Demo OTP has expired."
        };
    }

    if (enteredOTP !== savedOTP) {
        return {
            success: false,
            message: "Invalid demo OTP."
        };
    }

    return {
        success: true,
        message: "Demo phone verification successful!"
    };
}

module.exports = {
    createOTP,
    verifyOTP
};