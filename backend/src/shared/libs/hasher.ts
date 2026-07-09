import {hash as libHash, verify as libVerify} from 'argon2'
export const Hasher = {
    hash:(value:string)=>libHash(value),
    verify:(hash:string, value:string)=>libVerify(hash, value)
}