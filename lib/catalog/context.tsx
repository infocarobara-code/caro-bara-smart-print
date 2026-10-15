"use client";
import { createContext,useContext,type ReactNode } from "react";
import { categories } from "@/data/categories";
import type { Category } from "@/data/categories";
const CategoryContext=createContext<Category[]>(categories);
export function CategoryProvider({value,children}:{value:Category[];children:ReactNode}){return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>}
export function useCategories(){return useContext(CategoryContext)}
