/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jfmssfymrewzbnsbynxd.supabase.co',
        // port: '', // port je zvyčajne prázdny pre https
        // pathname: '/storage/v1/object/public/product-images/**', // Voliteľne, ak chceš obmedziť cestu
      },
    ],
  },
};

module.exports = nextConfig;
