const API = process.env.NEXT_PUBLIC_API_URL || "";

export type OfferStatus = "pending" | "accepted" | "rejected";

export type Offer = {
  id: string;
  partId?: string | number;
  inventoryId?: string | number;
  askingPrice?: number;
  offerPrice?: number;
  name?: string;
  email?: string;
  message?: string;
  status?: OfferStatus;
  createdAt?: string;
};

/**
 * GET /admin/offers
 * Adjust the path to match your backend if different.
 */
export async function listOffers(token: string): Promise<Offer[]> {
  const res = await fetch(`${API}/admin/offers`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Failed to list offers (${res.status})`);
  }
  return res.json();
}

/**
 * PATCH /admin/offers/:id
 * Update status (accepted/rejected/pending).
 */
export async function respondToOffer(
  token: string,
  offerId: string,
  body: { status: OfferStatus }
): Promise<{ ok: true }> {
  const res = await fetch(`${API}/admin/offers/${offerId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`Failed to update offer (${res.status})`);
  }
  return res.json();
}
