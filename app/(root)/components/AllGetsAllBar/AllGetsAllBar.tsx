"use client"

import { useDispatch } from "react-redux"

import ResetsStatesButton from "../ResetsStatesButton/ResetsStatesButton"
import { getAllBuyers } from "@/lib/actions/buyer.actions"
import { getAllMatches } from "@/lib/actions/match.actions"
import { getAllPosts } from "@/lib/actions/post.actions"
import { getAllSellers } from "@/lib/actions/seller.actions"
import { getAllCategories } from "@/lib/actions/category.actions"
import { setAllBuyers } from "@/lib/redux/slices/buyersSlice/buyersSlice"
import { setAllMatches } from "@/lib/redux/slices/matchesSlice/matchesSlice"
import { setAllPosts } from "@/lib/redux/slices/postsSlice/postsSlice"
import { setAllSellers } from "@/lib/redux/slices/sellersSlice/sellersSlice"
import { setAllCategories } from "@/lib/redux/slices/categoriesSlice/categoriesSlice"

export default function AllGetsAllBar() {

  const dispatch = useDispatch()

  async function handleGetAllBuyers() {
    const fetchAllBuyers = await getAllBuyers()
    if (fetchAllBuyers && fetchAllBuyers?.object) {
      dispatch(setAllBuyers(fetchAllBuyers?.object))
    }
  }

  async function handleGetAllMatches() {
    const fetchAllMatches = await getAllMatches()
    if (fetchAllMatches && fetchAllMatches?.object) {
      dispatch(setAllMatches(fetchAllMatches?.object))
    }
  }

  async function handleGetAllPosts() {
    const fetchAllPosts = await getAllPosts()
    if (fetchAllPosts && fetchAllPosts?.object) {
      dispatch(setAllPosts(fetchAllPosts?.object))
    }
  }

  async function handleGetAllSellers() {
    const fetchAllSellers = await getAllSellers()
    if (fetchAllSellers && fetchAllSellers?.object) {
      dispatch(setAllSellers(fetchAllSellers?.object))
    }
  }

  async function handleGetAllCategories() {
    const fetchAllCategories = await getAllCategories()
    if (fetchAllCategories && fetchAllCategories?.object) {
      dispatch(setAllCategories(fetchAllCategories?.object))
    }
  }

  function handleGetAlls() {
    handleGetAllBuyers()
    handleGetAllMatches()
    handleGetAllPosts()
    handleGetAllSellers()
    handleGetAllCategories()
  }

  return (
    <div className="flex flex-wrap justify-around">

      <div className="w-auto p-3">
        <button
          className="border rounded-md py-1 px-2"
          onClick={() => handleGetAllBuyers()}
        >
          Get Buyers
        </button>
      </div>

      <div className="w-auto p-3">
        <button
          className="border rounded-md py-1 px-2"
          onClick={() => handleGetAllMatches()}
        >
          Get Matches
        </button>
      </div>

      <div className="w-auto p-3">
        <button
          className="border rounded-md py-1 px-2"
          onClick={() => handleGetAllPosts()}
        >
          Get Posts
        </button>
      </div>

      <div className="w-auto p-3">
        <button
          className="border rounded-md py-1 px-2"
          onClick={() => handleGetAllSellers()}
        >
          Get Sellers
        </button>
      </div>

      <div className="w-auto p-3">
        <button
          className="border rounded-md py-1 px-2"
          onClick={() => handleGetAllCategories()}
        >
          Get Categories
        </button>
      </div>

      <div className="w-auto p-3">
        <button
          className="border rounded-md py-1 px-2"
          onClick={() => handleGetAlls()}
        >
          Get All
        </button>
      </div>

      <div className="w-auto p-3">
        <ResetsStatesButton />
      </div>

    </div>
  )
}
