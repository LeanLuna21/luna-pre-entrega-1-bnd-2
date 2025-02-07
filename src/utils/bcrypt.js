import { hashSync, compareSync, genSaltSync } from "bcrypt";

export const createHash = (password) => hashSync(password, genSaltSync(6))

export const validatePassword = (passIngresada, DBpassword) => compareSync(passIngresada, DBpassword)

