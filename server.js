require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json({ extended: false }));

const AccessToken = require("twilio").jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioApiKey = process.env.TWILIO_API_KEY;
const twilioApiSecret = process.env.TWILIO_API_SECRET;

app.post("/twilio/connect", (req, res) => {
    const { roomName, identity, role } = req.body;
    const authToken = req.headers.authorization;
    // Create Video Grant
    const videoGrant = new VideoGrant({
        room: roomName,
    });

    const token = new AccessToken(
        twilioAccountSid,
        twilioApiKey,
        twilioApiSecret,
        { identity: identity }
    );
    token.addGrant(videoGrant);

    const tokenJson = token.toJwt();

    return res.json({
        token: tokenJson,
        room: roomName,
        identity,
        role,
        roomType: "peer-to-peer",
    });
});

// (req, res, next) => {
//     const config = {
//         headers: { Authorization:  req.headers.authorization},
//     };

//     axios
//         .get("http://127.0.0.1:8000/authenticate", config)
//         .then(() => {
//             return next();
//         })
//         .catch((error) => {
//             console.log(error.response.status);
//             res.status(401).json({ msg: "Unauthorized" });
//         });
// };

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
