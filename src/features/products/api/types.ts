import z from "zod";
import { ProductSchema } from "./contracts";

export type Product = z.infer<typeof ProductSchema>;
