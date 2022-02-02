import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import {
  ShoppingCartIcon,
  MenuIcon,
  SearchIcon,
} from '@heroicons/react/outline'
import Cart from './Cart'
import * as Realm from 'realm-web'

const Header = () => {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [autoComplete, setAutoComplete] = useState([])

  useEffect(async () => {
    if (searchTerm.length) {
      // add your Realm App Id to the .env.local file
      const REALM_APP_ID = 'products-rdcyx'
      const app = new Realm.App({ id: REALM_APP_ID })
      const credentials = Realm.Credentials.anonymous()
      try {
        const user = await app.logIn(credentials)
        const searchAutoComplete = await user.functions.searchAutocomplete(
          searchTerm
        )
        setAutoComplete(() => searchAutoComplete)
      } catch (error) {
        console.error(error)
      }
    } else {
      setAutoComplete([])
    }
  }, [searchTerm])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchTerm) {
      router.push({
        pathname: `search/${searchTerm}`,
      })
    }
    setSearchTerm('')
  }

  const handleSelect = (id) => {
    setSearchTerm('')
    router.push({
      pathname: `/products/${id}`,
    })
  }

  return (
    <>
      <header>
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="w-full cursor-pointer text-2xl font-semibold text-green-500">
                MongoStore
              </div>
            </Link>
            <div className="flex w-full items-center justify-end">
              <button className="mx-4 text-gray-600 focus:outline-none sm:mx-0">
                <ShoppingCartIcon
                  onClick={() => setIsCartOpen(!isCartOpen)}
                  className="h-5 w-5"
                />
              </button>

              <div className="flex sm:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  type="button"
                  className="text-gray-600 hover:text-gray-500 focus:text-gray-500 focus:outline-none"
                  aria-label="toggle menu"
                >
                  <MenuIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <nav
            className={`${
              isMenuOpen ? '' : 'hidden'
            } mt-4 sm:flex sm:items-center sm:justify-center`}
          >
            <div className="flex flex-col sm:flex-row">
              <div className="mt-3 text-gray-600 hover:underline sm:mx-3 sm:mt-0">
                <Link href="/">Home</Link>
              </div>
              <div className="mt-3 text-gray-600 hover:underline sm:mx-3 sm:mt-0">
                <Link href="/products">Shop</Link>
              </div>
              <a
                className="mt-3 text-gray-600 hover:underline sm:mx-3 sm:mt-0"
                href="#"
              >
                Categories
              </a>
              <a
                className="mt-3 text-gray-600 hover:underline sm:mx-3 sm:mt-0"
                href="#"
              >
                Contact
              </a>
              <a
                className="mt-3 text-gray-600 hover:underline sm:mx-3 sm:mt-0"
                href="#"
              >
                About
              </a>
            </div>
          </nav>

          <div className="relative mx-auto mt-6 max-w-lg">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon className="h-5 w-5" />
            </span>

            <form onSubmit={handleSubmit}>
              <input
                className="focus:shadow-outline w-full rounded-md border py-2 pl-10 pr-4 focus:border-green-500 focus:outline-none"
                type="text"
                placeholder="Search"
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
              />
            </form>
            {/* ========================== */}
            {autoComplete.length > 0 && (
              <ul className="absolute inset-x-0 top-full z-20 rounded-md border border-green-500 bg-green-200">
                {autoComplete.map((item) => {
                  return (
                    <li
                      key={item._id}
                      className="cursor-pointer px-4 py-2 hover:bg-green-300"
                      onClick={() => handleSelect(item._id)}
                    >
                      {item.name}
                    </li>
                  )
                })}
              </ul>
            )}

            {/* ==================:     */}
          </div>
        </div>
      </header>
      <Cart isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
    </>
  )
}

export default Header
