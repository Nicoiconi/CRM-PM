"use server"

import Buyer from "../models/buyer.model"
import Category from "../models/category.model";
import Match from "../models/match.model";
import Post from "../models/post.model";
import Seller from "../models/seller.model";
import User from "../models/user.model";
import { connectToDatabase } from "../mongoose";

enum Schemas {
  Buyer = "Buyer",
  Seller = "Seller",
  Category = "Category",
  Post = "Post",
  Match = "Match",
  User = "User"
}

enum PropTypes {
  String = "string",
  Number = "number",
  Object = "object",
  Boolean = "boolean",
  Function = "function"
  // Null = "object"
}

interface Props {
  schema: string
  propertyName: string
  newValue?: "string" | "number" | "object" | "array"
}

function getFormattedDate() {
  const date = new Date();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero indexed, so we add 1
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2); // Taking the last two digits of the year
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${month}${day}${year}${hours}${minutes}${seconds}`;
}

export async function resetProperyValues({ schema, propertyName, newValue }: Props) {

  console.log(schema, propertyName)

  await connectToDatabase()

  if (schema === Schemas.Buyer) {

    const allDocuments = await Buyer.find()
    console.log("allDocuments", allDocuments)

    for (const eachDocument of allDocuments) {
      console.log(eachDocument[propertyName])

      if (eachDocument[propertyName]) {

        let propType: string | boolean = Array.isArray(eachDocument[propertyName]) ? "array" : false

        if (!propType && eachDocument[propertyName] !== null) {
          propType = typeof eachDocument[propertyName]
        }

        if (!propType) {
          console.log("The value is already null")
        }

        if (propType !== typeof newValue) {
          console.log("New value type does not match prop type value")
        }

        if (propType === "number") {
          await Buyer.findByIdAndUpdate(
            eachDocument?._id,
            { $set: { [`${propertyName}`]: newValue || 0 } } // verificar si es válido
          )
        }

        if (propType === "object") {
          await Buyer.findByIdAndUpdate(
            eachDocument?._id,
            { $set: { [`${propertyName}`]: newValue || {} } } // verificar si es válido
          )
        }

        if (propType === "string") {
          await Buyer.findByIdAndUpdate(
            eachDocument?._id,
            { $set: { [`${propertyName}`]: newValue || "" } } // verificar si es válido
          )
        }

        if (propType === "array") {
          await Buyer.findByIdAndUpdate(
            eachDocument?._id,
            { $set: { [`${propertyName}`]: newValue || [] } } // verificar si es válido
          )
        }
      }
    }
  }

  if (schema === Schemas.Seller) {

    const allDocuments = await Seller.find()

    for (const eachDocument of allDocuments) {

      if (eachDocument[propertyName]) {

        let propType: string | boolean = Array.isArray(eachDocument[propertyName]) ? "array" : false

        if (!propType && eachDocument[propertyName] !== null) {
          propType = typeof eachDocument[propertyName]
        }

        if (!propType) {
          console.log("The value is already null")
        }

        if (propType === "number") {
          await Seller.findByIdAndUpdate(
            eachDocument?._id,
            { $set: { [`${propertyName}`]: 0 } } // verificar si es válido
          )
        }

        if (propType === "object") {
          await Seller.findByIdAndUpdate(
            eachDocument?._id,
            { $set: { [`${propertyName}`]: {} } } // verificar si es válido
          )
        }

        if (propType === "string") {
          await Seller.findByIdAndUpdate(
            eachDocument?._id,
            { $set: { [`${propertyName}`]: "" } } // verificar si es válido
          )
        }

        if (propType === "array") {
          await Seller.findByIdAndUpdate(
            eachDocument?._id,
            { $set: { [`${propertyName}`]: [] } } // verificar si es válido
          )
        }
      }
    }
  }

  if (schema === Schemas.Category) {

    const allDocuments = await Category.find()

    for (const eachDocument of allDocuments) {

      if (eachDocument[propertyName]) {

        let propType: string | boolean = Array.isArray(eachDocument[propertyName]) ? "array" : false

        if (!propType && eachDocument[propertyName] !== null) {
          propType = typeof eachDocument[propertyName]
        }

        if (!propType) {
          console.log("The value is already null")
        }

        if (propType === "number") {
          await Category.findByIdAndUpdate(
            eachDocument?._id,
            { $set: { [`${propertyName}`]: 0 } } // verificar si es válido
          )
        }

        if (propType === "object") {
          await Category.findByIdAndUpdate(
            eachDocument?._id,
            { $set: { [`${propertyName}`]: {} } } // verificar si es válido
          )
        }

        if (propType === "string") {
          await Category.findByIdAndUpdate(
            eachDocument?._id,
            { $set: { [`${propertyName}`]: "" } } // verificar si es válido
          )
        }

        if (propType === "array") {
          await Category.findByIdAndUpdate(
            eachDocument?._id,
            { $set: { [`${propertyName}`]: [] } } // verificar si es válido
          )
        }
      }
    }
  }

  if (schema === Schemas.Post) {

    const allDocuments = await Post.find()

    for (const eachDocument of allDocuments) {

      if (eachDocument[propertyName]) {

        let propType: string | boolean = Array.isArray(eachDocument[propertyName]) ? "array" : false

        if (!propType && eachDocument[propertyName] !== null) {
          propType = typeof eachDocument[propertyName]
        }

        if (!propType) {
          console.log("The value is already null")
        }

        if (propType === "number") {
          await Post.findByIdAndUpdate(
            eachDocument?._id,
            { $set: { [`${propertyName}`]: 0 } } // verificar si es válido
          )
        }

        if (propType === "object") {
          await Post.findByIdAndUpdate(
            eachDocument?._id,
            { $set: { [`${propertyName}`]: {} } } // verificar si es válido
          )
        }

        if (propType === "string") {
          await Post.findByIdAndUpdate(
            eachDocument?._id,
            { $set: { [`${propertyName}`]: "" } } // verificar si es válido
          )
        }

        if (propType === "array") {
          await Post.findByIdAndUpdate(
            eachDocument?._id,
            { $set: { [`${propertyName}`]: [] } } // verificar si es válido
          )
        }
      }
    }
  }

  if (schema === Schemas.Match) {

    const allDocuments = await Match.find()

    for (const eachDocument of allDocuments) {

      if (eachDocument[propertyName]) {

        let propType: string | boolean = Array.isArray(eachDocument[propertyName]) ? "array" : false

        if (!propType && eachDocument[propertyName] !== null) {
          propType = typeof eachDocument[propertyName]
        }

        if (!propType) {
          console.log("The value is already null")
        }

        if (propType === "number") {
          await Match.findByIdAndUpdate(
            eachDocument?._id,
            { $set: { [`${propertyName}`]: 0 } } // verificar si es válido
          )
        }

        if (propType === "object") {
          await Match.findByIdAndUpdate(
            eachDocument?._id,
            { $set: { [`${propertyName}`]: {} } } // verificar si es válido
          )
        }

        if (propType === "string") {
          await Match.findByIdAndUpdate(
            eachDocument?._id,
            { $set: { [`${propertyName}`]: "" } } // verificar si es válido
          )
        }

        if (propType === "array") {
          await Match.findByIdAndUpdate(
            eachDocument?._id,
            { $set: { [`${propertyName}`]: [] } } // verificar si es válido
          )
        }
      }
    }
  }

  if (schema === Schemas.User) {

    const allDocuments = await User.find()

    for (const eachDocument of allDocuments) {

      if (eachDocument[propertyName]) {

        let propType: string | boolean = Array.isArray(eachDocument[propertyName]) ? "array" : false

        if (!propType && eachDocument[propertyName] !== null) {
          propType = typeof eachDocument[propertyName]
        }

        if (!propType) {
          console.log("The value is already null")
        }

        if (propType === "number") {
          await User.findByIdAndUpdate(
            eachDocument?._id,
            { $set: { [`${propertyName}`]: 0 } } // verificar si es válido
          )
        }

        if (propType === "object") {
          await User.findByIdAndUpdate(
            eachDocument?._id,
            { $set: { [`${propertyName}`]: {} } } // verificar si es válido
          )
        }

        if (propType === "string") {
          await User.findByIdAndUpdate(
            eachDocument?._id,
            { $set: { [`${propertyName}`]: "" } } // verificar si es válido
          )
        }

        if (propType === "array") {
          await User.findByIdAndUpdate(
            eachDocument?._id,
            { $set: { [`${propertyName}`]: [] } } // verificar si es válido
          )
        }
      }
    }
  }
}