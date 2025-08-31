import axios from "axios";
import { JSDOM } from "jsdom";

export interface ProfileResult {
  success: boolean;
  handle: string;
  profile?: string;
  name?: string;
  currentRating?: number;
  highestRating?: number;
  globalRank?: number;
  countryRank?: number;
  stars?: string;
  error?: string;
  status?: number;
}

export async function fetchProfile(
  handle: string,
  retries = 3
): Promise<ProfileResult> {
  try {
    const res = await axios.get(`https://www.codechef.com/users/${handle}`, {
      headers: { "User-Agent": "Mozilla/5.0" },
      validateStatus: () => true,
    });

    if (res.status === 404) {
      return {
        success: false,
        handle,
        error: "Profile not found",
        status: 404,
      };
    }

    if (res.status !== 200) {
      return {
        success: false,
        handle,
        error: `Unexpected status ${res.status}`,
        status: res.status,
      };
    }

    const html: string = res.data;
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // ✅ Check if profile container exists
    const container = document.querySelector(".user-details-container");
    if (!container) {
      return {
        success: false,
        handle,
        error: "Profile not found (no user-details-container)",
        status: 200,
      };
    }

    const allRating = html.search("var all_rating = ") + "var all_rating = ".length;
    const allRating2 = html.search("var current_user_rating =") - 6;

    let ratingData: any = [];
    try {
      ratingData = JSON.parse(html.substring(allRating, allRating2));
    } catch {
      ratingData = [];
    }

    const safeParseInt = (value: string | null | undefined, fallback = 0) =>
      value ? parseInt(value) : fallback;

    return {
      success: true,
      handle,
      profile: container.querySelector<HTMLImageElement>("img")?.src ?? "",
      name: container.querySelector("span")?.textContent ?? "",
      currentRating: safeParseInt(
        document.querySelector(".rating-number")?.textContent,
        0
      ),
      highestRating: safeParseInt(
        document
          .querySelector(".rating-number")
          ?.parentNode?.children[4]?.textContent?.split("Rating")[1],
        0
      ),
      globalRank: safeParseInt(
        document.querySelector(".rating-ranks")?.children[0]?.children[0]
          ?.children[0]?.children[0]?.innerHTML,
        0
      ),
      countryRank: safeParseInt(
        document.querySelector(".rating-ranks")?.children[0]?.children[1]
          ?.children[0]?.children[0]?.innerHTML,
        0
      ),
      stars: document.querySelector(".rating")?.textContent || "unrated",
    };
  } catch (err: any) {
    if (err.response?.status === 429 && retries > 0) {
      console.log(`Rate limit hit for ${handle}, retrying after delay...`);
      await new Promise((r) => setTimeout(r, 5000));
      return fetchProfile(handle, retries - 1);
    }
    return { success: false, handle, error: err.message };
  }
}