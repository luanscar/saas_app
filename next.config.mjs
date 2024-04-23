/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "uploadthing.com",
      "utfs.io",
      "img.clerk.com",
      "subdomain",
      "files.stripe.com",
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com",
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
