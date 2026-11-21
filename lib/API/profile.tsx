// Profile API calls live here so the page only handles UI and state.
// The fetch helpers for reading and updating a profile are already written
// in service.tsx, so we simply re-export them from this file.

export { getProfile, updateProfile } from "./service"
export type { Profile } from "./service"

// Upload an image to imgbb and return the direct link (i.ibb.co)
// that is saved in MongoDB.
export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append("image", file)

  // The key may be named either way in .env, so use whichever one exists.
  const key =
    process.env.NEXT_PUBLIC_IMGBB_KEY ||
    process.env.NEXT_PUBLIC_IMGBB_API_KEY

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
    method: "POST",
    body: formData,
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok || !data.success) {
    throw new Error("Image upload failed.")
  }

  // The direct i.ibb.co link.
  return data.data.url
}
