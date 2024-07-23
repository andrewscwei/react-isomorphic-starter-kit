# [17.0.0](https://github.com/andrewscwei/react-isomorphic-starter-kit/compare/v16.1.0...v17.0.0) (2024-07-23)


### Bug Fixes

* Accessing window in SSR ([f434a91](https://github.com/andrewscwei/react-isomorphic-starter-kit/commit/f434a91fe65d9fba0e0a374b8cea2dceec5ab779))
* Base path ([1afb1ba](https://github.com/andrewscwei/react-isomorphic-starter-kit/commit/1afb1ba0ff4c9f6b0d9a5ba9b4b11d9b33369be1))
* Disable debug when not in development ([f474def](https://github.com/andrewscwei/react-isomorphic-starter-kit/commit/f474deffb206a8c989d700bf9170be88a6cecb36))
* Favicon paths ([aa6fa0f](https://github.com/andrewscwei/react-isomorphic-starter-kit/commit/aa6fa0f8433747fccbc480ca3a71678704896a95))
* FOUC during SSR ([cd9e39d](https://github.com/andrewscwei/react-isomorphic-starter-kit/commit/cd9e39d32bc189c72dde068cfece0999962fa60e))
* getLocalizedURL ([ee16f86](https://github.com/andrewscwei/react-isomorphic-starter-kit/commit/ee16f86b136da945fcefa26c5a1a6b65ef4c917e))
* joinURL ([5165eb7](https://github.com/andrewscwei/react-isomorphic-starter-kit/commit/5165eb7dfdea9074df61a1737ad8d96acc3d2ce3))
* Prerendering ([38b4040](https://github.com/andrewscwei/react-isomorphic-starter-kit/commit/38b40409de5d6a5bd30b18b200e3073d25476c55))
* Prerendering ([9d7a16e](https://github.com/andrewscwei/react-isomorphic-starter-kit/commit/9d7a16ec0b125f3a12488ccf1970c6fb17b3d5ed))
* Prerendering ([8c117ed](https://github.com/andrewscwei/react-isomorphic-starter-kit/commit/8c117eda03940eea8824c0800a7c33f6b01a855e))
* Prerendering ([9c525a4](https://github.com/andrewscwei/react-isomorphic-starter-kit/commit/9c525a4a4438348a10ba861b4b27a92292c285c2))
* Remove root from vite.config.ts because it causes VITE_ variables to not be loaded ([5274c24](https://github.com/andrewscwei/react-isomorphic-starter-kit/commit/5274c24ad9992cb882fbd8990b84a3ebfb099542))
* Reset rootDir ([92bc938](https://github.com/andrewscwei/react-isomorphic-starter-kit/commit/92bc93888886527595de0822c83efe7a6e1dad8e))
* Resolve wrangler warnings ([8447b7c](https://github.com/andrewscwei/react-isomorphic-starter-kit/commit/8447b7c8dad8e04df843ca0d82ea92f9e67b1e15))
* Server entry file ([3aaa827](https://github.com/andrewscwei/react-isomorphic-starter-kit/commit/3aaa8274269e08a15f2b4018ed56aa55fb3cf776))
* Server script ([8894a01](https://github.com/andrewscwei/react-isomorphic-starter-kit/commit/8894a01ff1d6e77da491f156091c44bb5706ebd5))
* Unit tests ([6c340a4](https://github.com/andrewscwei/react-isomorphic-starter-kit/commit/6c340a4d803a4fb91793937114a8f289f3451b9f))
* Use serve to run start:statuc instead ([550e9eb](https://github.com/andrewscwei/react-isomorphic-starter-kit/commit/550e9eb2ac97f5444fe061bb6fdcb512993b2bed))
* Vitest config ([6001258](https://github.com/andrewscwei/react-isomorphic-starter-kit/commit/6001258c16876b9e219111a086c3c66dfe07973d))


### Build System

* Upgrade dependencies ([7f14189](https://github.com/andrewscwei/react-isomorphic-starter-kit/commit/7f14189952b5bcfc9daed9846d3665342b426355))


### Features

* Add 'test' namespace to createDebug ([d7c532a](https://github.com/andrewscwei/react-isomorphic-starter-kit/commit/d7c532a8b1807327e9dd1e078c34973b85ddd60c))
* Add built time ([abced20](https://github.com/andrewscwei/react-isomorphic-starter-kit/commit/abced20d7487dc52b22ea9cc46059d7473a6460c))
* Add defineConfig ([9dbf701](https://github.com/andrewscwei/react-isomorphic-starter-kit/commit/9dbf7013feab1ff5d05ad74aff707cb4077b0bd7))
* Add dev:edge script ([7c3c52f](https://github.com/andrewscwei/react-isomorphic-starter-kit/commit/7c3c52f83124f1342d71ea2777d6a4422818991c))
* Allow custom replacement in template ([c90f7ea](https://github.com/andrewscwei/react-isomorphic-starter-kit/commit/c90f7ea48cb15e3b3362d3ed22166d6f4f37d5fa))
* Consolidate handlers into one for edge ([781d0e9](https://github.com/andrewscwei/react-isomorphic-starter-kit/commit/781d0e912a286a871e3a202106c969fa3ede5078))
* Fix ESR ([fbf3153](https://github.com/andrewscwei/react-isomorphic-starter-kit/commit/fbf3153f8968084b00322383bc5f55f322bbfefc))
* Minify HTML in SSR ([9395252](https://github.com/andrewscwei/react-isomorphic-starter-kit/commit/9395252a36a6e86a0fac9cc6989b74cd20a957fc))
* Minify HTML properly ([6494a09](https://github.com/andrewscwei/react-isomorphic-starter-kit/commit/6494a097daff3a1c48e76f166fc52d0ccdfa022d))
* Update ESR ([4a1b660](https://github.com/andrewscwei/react-isomorphic-starter-kit/commit/4a1b6606f538597b41d9d728282aa94650f4bfc6))
* Update lib ([b0dd4a6](https://github.com/andrewscwei/react-isomorphic-starter-kit/commit/b0dd4a6cc46c09117ab2d83cb71662a10d4db9e6))


### BREAKING CHANGES

* Fully migrate to Vite
