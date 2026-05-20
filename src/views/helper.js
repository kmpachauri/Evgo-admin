import { imgBaseUrl } from "../hooks/useAxios"

export const imageFullUrl =(url)=>{
    return `${imgBaseUrl}${url}`
}