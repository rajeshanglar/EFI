# Conference Registration Implementation Guide

## Overview
This document describes the Conference Registration screen implementation in the EFI React Native application.

## Files Created/Modified

### 1. Conference Registration Page
**File:** `src/pages/conference/ConferenceRegistrationPage.tsx`

**Features:**
- **Header Section:**
  - Back button (left arrow icon)
  - "Conference Registration" title
  - Home icon button (right)

- **Conference Details:**
  - Main title: "3rd Edition of Endometriosis Congress"
  - Date and location: "6, 7 & 8 MARCH 2026, Park Hyatt, Hyderabad"

- **Membership Selection:**
  - Radio buttons for "EFI Members" and "Non EFI Members"
  - Yellow selected state for radio buttons

- **Registration Tier Tabs:**
  - **Early Bird**: Upto 15 Oct 2025
  - **Regular**: Upto 15 Feb 2026
  - **On Spot**: After 15 Feb 2026
  - Active tab highlighted with blue underline

- **Registration Options:**
  - National - Standard: ₹ 11,000
  - National - PG's/Fellows: ₹ 6,000
  - International - Standard: 190 USD
  - International - PG's/Fellows: 100 USD

- **Footer:**
  - "Already an EFI Member?"
  - "Click Here to Continue" link

- **Information Icon:**
  - Floating circular button (bottom right)
  - Blue background with yellow information icon
  - Opens information modal on click

### 2. Information Modal
**Component:** Built-in modal in ConferenceRegistrationPage

**Content Sections:**

1. **Important:**
   - Registration fee exclusive of GST @  η}
   - Membership number mandatory
   - Mobile number and email required

2. **Registration Guidelines:**
   - Online charges 3% of total
   - Registration fees include all amenities
   - No delegate kit for spot registrations
   - Certificate available after feedback submission

3. **Cancellation & Refund Policy:**
   - Cancellation via email/post
   - No refund after 15.11.2025
   - 30% processing charge deduction

**Modal Features:**
- White background with rounded corners
- Blue section headings
- Scrollable content
- Close button (yellow circle with X)

### 3. Updated Files

#### Icons (`src/components/icons/index.tsx`)
Added:
- `InfoIcon` export for the information modal button

#### HomePage (`src/pages/home/HomePage.tsx`)
Modified:
- Added `onNavigateToConference` prop
- Updated Conference Registration button to trigger navigation

#### App.tsx
Modified:
- Added page navigation state management
- Implemented routing between:
  - Login
  - Home
  - Conference Registration

### 4. Index File
**File:** `src/pages/conference/index.tsx`
- Exports ConferenceRegistrationPage

## Navigation Flow

1. **From Home Page:**
   - Click "Conference Registration" button
   - Navigate to Conference Registration page

2. **From Conference Registration:**
   - Back button → Return to Home
   - Home icon → Return to Home
   - Information icon → Open information modal

3. **Modal:**
   - Close button → Close modal
   - Backdrop tap (Android) → Close modal

## Styling

All styles follow the existing design system:
- Primary color: Dark blue (#08265D)
- Accent color: Yellow (#FFE610)
- Fonts: Poppins (Regular, Medium, SemiBold, Bold)
- Spacing and border radius from globalStyles
- Responsive sizing using screen dimensions

## Assets Used

- `info-icon.svg`: Information icon for modal button
- `home-icon.svg`: Home navigation icon
- `arrow-right-icon.svg`: Back button (rotated)

## Functionality

### State Management:
- `membershipType`: Tracks EFI/Non-EFI selection
- `registrationTier`: Tracks Early Bird/Regular/On Spot tabs
- `isModalVisible`: Controls modal visibility

### Interactive Elements:
- Radio buttons for membership selection
- Tab buttons for registration tier
- Information button (floating)
- Navigation buttons (back, home)
- Footer link (placeholder for future functionality)

## Future Enhancements

- Registration form for each option
- Payment integration
- Authentication check for EFI members
- Dynamic pricing based on tier
- Form validation
- Success/failure handling

## Notes

- UI matches the provided design specifications
- All navigation routes are properly wired
- Modal is scrollable for long content
- No existing UI was modified
- All components follow the existing design system
- Fully responsive layout

