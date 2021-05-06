const nock = require("nock");
const jwt = require("jsonwebtoken");
const authConfig = require("../../../auth_config.json");

const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEA1QH5TgytUiMZmycqLoJCtTnta5Fapc9vCTjj4oI7N5jgztZT
vGZWyngxx+gX/5Z6jXMD4Dcq9xuDOCJkpY2j5wpfb0Mw2U6Ra+o2I9x8wTLJyODW
JWZnaAKmPxr5ZX+Jq8afgTYUThFBmIG7LPgpnB5pyOc+XT5hVwMEe4+BqQj7+hgJ
79Q5Vp35YUPcFGytIGymFOk+dr6e2Bh2edFWhVuMsF+E/GzYYRrNwyIf+3TxROch
cxn5K9+VGxVgaopzLPieZu033qAmmvvi5qEQhW5cyhSaF29RSKyz2GzEE012bfa4
6hwX3j+A78JsmT2xPvYM2scOtxEUdiFRDkVAJQIDAQABAoIBAF4MKQ8U+dGyPbQL
bsxqJxntIa7E1sku9U+VFskDxzGdBmVMrFwas2dh+ljRWQc4YZPinGt68DV6qE04
okeWai+wnMJ7YC4SSpLjLlRXHZ4P1pgi7WpF9JIv2Uczmbn+vcJiSDq8repqJBQ5
83K/f1+27e4Oa7KvwDqy0l/b1NvUlPCUJs8IwMAAhDcrsdVVoxpROluW8yA7zRDW
r+y5HSHY4yACc8iDspB5ISIONV1RBQrEKPU3hNmj9a3cILkrX+jJGXkzKrDrK+VO
6n+3LFjy8FUNW6yAMUq9SvVkftvDd0CmMAddAT6bLjyiunjODxQTGuvEadAR1e/w
gnDZVGECgYEA2WpootN333dDj8lkRGUDnw3ug63P1cYKixHkYej9+Sjul6OHfloO
3mdOtgxL5mCt6LPjOOIM2qVujfyxX6QXHxmdlrM7WjcxLbXSUO0DLuFRlutmbAoc
+FEqAZdhZ7dmWRj7zbfF4kLq58rbyC4hkyYx93OhszFKWlXpg/JXc6sCgYEA+s9N
zo7z0MVd6fw8X0RUYl4vh9qqlW2v7OBtr5uTFTaT1yyk5DXe55uPflAA+rk50A2S
a4/8QYypp8QiVakc1Ft34xcGRKtGO6IuvRcdqyRLr8mb+9rS070h0reHm31cFQPA
PRtuaONXmUmOCZkcMHrX6PcKjfJi8wPHhytlS28CgYBX9lA9SFdgZu1DuFRDw6ay
bD2KswC6WbScTXHcFxrh+qiFW1kPSrpnSt6ykskGfSj/VABjXDmdIH9ZHNpaepYM
NB3pAbzKpDfWaZCcwzedePW8nKLEpVbRNG1NVYTIJJBZDd2afnamMzK88vr2w4s7
8KEYn4TVbeTKJaYjhyHQnwKBgQCHer2Ty2JmroY5Y3gVGerfK/NO1k5440Q5l02I
o2gC+HVJsSLs5zCeOUh8uaidxro06W/jTGa93cazCd5mGTCqgTI0Z/aJ117bzZKj
r73l+Xgs36GznRNvLuX7VgoZctDvxRPtrkiovc1Ozw27n4o7oc/JVtDLtle+35bD
LCzOXwKBgCYi32gT+/F/3mxBj56gLkV5ZoVpba+UXNJFeI1ux1uC+hG5EFboHL/g
tNyv7ONQ3mjZdQS1vFXNTzh2iFl8kS+kU5/6nksaZFoATwxHwtDoEjYhUftWyB0M
A80kdPr2HkZmFGKH8fvLDH6TIUJCiyOm8DRYHbBT8bC6TXyeTPAG
-----END RSA PRIVATE KEY-----`;

const nockReply = {
	keys: [
		{
			alg: "RS256",
			kty: "RSA",
			use: "sig",
			n:
				"1QH5TgytUiMZmycqLoJCtTnta5Fapc9vCTjj4oI7N5jgztZTvGZWyngxx-gX_5Z6jXMD4Dcq9xuDOCJkpY2j5wpfb0Mw2U6Ra-o2I9x8wTLJyODWJWZnaAKmPxr5ZX-Jq8afgTYUThFBmIG7LPgpnB5pyOc-XT5hVwMEe4-BqQj7-hgJ79Q5Vp35YUPcFGytIGymFOk-dr6e2Bh2edFWhVuMsF-E_GzYYRrNwyIf-3TxROchcxn5K9-VGxVgaopzLPieZu033qAmmvvi5qEQhW5cyhSaF29RSKyz2GzEE012bfa46hwX3j-A78JsmT2xPvYM2scOtxEUdiFRDkVAJQ",
			e: "AQAB",
			kid: "IARiznRji6IVoboYnCaDF",
		},
	],
};

nock(authConfig.domain)
	.persist()
	.get("/.well-known/jwks.json")
	.reply(200, nockReply);

const getToken = () => {
	const user = {
		email: "cpan271@aucklanduni.ac.nz",
	};

	const payload = {
		nickname: user.email.split("@").shift(),
		name: user.email,
		sub: "testing-user-one-sub",
	};

	const options = {
		issuer: authConfig.domain,
		header: { kid: "IARiznRji6IVoboYnCaDF" },
		algorithm: "RS256",
		expiresIn: "20d",
		audience: authConfig.audience,
	};

	let token;
	try {
		token = jwt.sign(payload, privateKey, options);
	} catch (err) {
		console.log(err);
		throw err;
	}

	return token;
};

module.exports = {
	getToken,
};
