import { API_URL } from "@/lib/routes/api";
import authService from "./auth.service";

const uploadImage = async (folder: string, body: File[]) => {
  const formData = new FormData();
  body.forEach((file, index) => {
    formData.append("files", file); // 'file0', 'file1', etc.
  });
  formData.append("folder", folder);
  const requestOptions: any = {
    method: "POST",
    body: formData,
    redirect: "follow",
    headers: {
      Authorization: `Bearer ${authService.getToken()}`,
    },
  };
  const res = await fetch(`${API_URL}/files`, requestOptions);
  return res.json();
};
export default { uploadImage };
