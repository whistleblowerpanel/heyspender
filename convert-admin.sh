#!/bin/bash

# Convert React Router admin dashboard to Next.js

INPUT_FILE="ORIGINAL_REACT_ADMIN.jsx"
OUTPUT_FILE="src/app/admin/dashboard/page.tsx"

# Start with "use client"
echo '"use client";' > "$OUTPUT_FILE"
echo '' >> "$OUTPUT_FILE"

# Process the file line by line
cat "$INPUT_FILE" | \
  # Remove Helmet import
  grep -v "import { Helmet } from 'react-helmet';" | \
  # Replace React Router imports with Next.js imports
  sed "s/import { useNavigate, useLocation } from 'react-router-dom';/import { useRouter, usePathname } from 'next\/navigation';/" | \
  # Remove Helmet usage (opening tag)
  sed 's/<Helmet>/<>/g' | \
  # Remove Helmet usage (closing tag)
  sed 's/<\/Helmet>/<\/>/g' | \
  # Remove title tags inside Helmet
  sed '/<title>/d' | \
  # Replace useNavigate with useRouter
  sed 's/const navigate = useNavigate();/const router = useRouter();/' | \
  # Replace useLocation with usePathname
  sed 's/const location = useLocation();/const pathname = usePathname();/' | \
  # Replace navigate( with router.push(
  sed 's/navigate(/router.push(/g' | \
  # Replace location.pathname with pathname
  sed 's/location\.pathname/pathname/g' | \
  # Replace .jsx extension in imports
  sed "s/'@\/components\/admin\/AdminNotifications.jsx'/'@\/components\/admin\/AdminNotifications'/g" \
  >> "$OUTPUT_FILE"

echo "Conversion complete! Output saved to $OUTPUT_FILE"

