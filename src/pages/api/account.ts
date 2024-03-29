import { parseJwt } from "@/utils/parseJwt";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const accessToken = req.cookies.token; // Assuming the access token is stored in an HTTP-only cookie named 'token'
  const idToken = req.cookies.id_token; // Assuming the ID token is stored in an HTTP-only cookie named 'id_token'

  try {
    // Assuming idToken is the JWT ID token you received
    const decodedToken = parseJwt(idToken);
    const accountId = decodedToken.sub;
    console.log(accessToken, accountId);

    const vanaResponse = await fetch(
      `${process.env.NEXT_PUBLIC_VANA_API_URL}/api/v0/accounts/${accountId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(vanaResponse);
    if (!vanaResponse.ok) {
      throw new Error("Failed to fetch accounts");
    }

    const accountsData = await vanaResponse.json();
    res.status(200).json(accountsData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
