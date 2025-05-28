import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function DocLayout({ children, meta = {} }) {
  const router = useRouter();
  const { title, description, image } = meta;
  const siteTitle = 'Documentation';
  const pageTitle = title ? `${title} | ${siteTitle}` : siteTitle;

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={description || 'Documentation for email and domain tools'} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={description || 'Documentation for email and domain tools'} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={description || 'Documentation for email and domain tools'} />
        {image && <meta property="og:image" content={image} />}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              <a href="/" className="hover:text-primary-600 transition-colors">
                {siteTitle}
              </a>
            </h1>
            <nav className="hidden md:flex space-x-8">
              <a href="/components/email/EmailValidator" className="text-gray-600 hover:text-primary-600 transition-colors">
                Email Tools
              </a>
              <a href="/components/tools/DomainAgeChecker" className="text-gray-600 hover:text-primary-600 transition-colors">
                Domain Tools
              </a>
              <a href="/blog" className="text-gray-600 hover:text-primary-600 transition-colors">
                Blog
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Documentation. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
