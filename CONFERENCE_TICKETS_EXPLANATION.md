src/pages/conference/registration/
├── ChooseConferencePackage.tsx
├── NonResidentialPackages.tsx
├── ResidentialPackages.tsx
├── ConferenceRegistrationForm.tsx
├── ConferencePaymentDetails.tsx
├── ConferenceQRCode.tsx
└── ConferenceRegistrationContent/
    ├── DynamicModuleContent.tsx
    ├── ConferenceOnlyContentNo.tsx
    └── PreCongressWorkshopsContent.tsx


# Non-Residential Packages - Conference Tickets Explanation

## Overview
The Non-Residential Packages page displays conference tickets fetched from the API. Tickets are shown for both **EFI Members** and **Non EFI Members**, with prices dynamically changing based on the selected membership type.

## API Call Flow

### 1. API Endpoint
```typescript
GET v1/event-mappings
```
- **Service**: `GetEventMappings()` in `staticService.ts`
- **Uses**: `apiStatic` (uses STATIC_API_TOKEN)
- **Location**: `src/services/staticService.ts:108`

### 2. Data Structure (API Response)

The API returns an array of `EventMapping` objects with the following structure:

```typescript
EventMapping {
  id: number
  event_name: string           // e.g., "EFI Conference 2024"
  description: string          // Event date and location
  start_date: string
  end_date: string
  modules: Module[]             // Array of modules (tabs)
}

Module {
  id: number
  module_name: string          // e.g., "Main Conference", "Pre-Conference Workshop"
  description: string
  categories: Category[]       // Registration tiers/categories
}

Category {
  id: number
  name: string                 // e.g., "Early Bird", "Regular", "Pre-Conference Workshop"
  is_residential: number       // 0 = Non-Residential, 1 = Residential
  sort_order: number
  tickets: Ticket[]            // Available tickets in this category
}

Ticket {
  id: number
  name: string                 // Ticket name
  member_price: number         // Price for EFI Members
  non_member_price: number     // Price for Non EFI Members
  currency: string             // e.g., "INR", "USD"
  category_till_date: string   // Early bird deadline (optional)
  category_after_date: string // Regular pricing start date (optional)
  mapping_id: number           // Used for price calculation
  sort_order: number
}
```

## Data Flow in NonResidentialPackages Component

### Step 1: Fetch Event Mappings
```typescript
// Location: NonResidentialPackages.tsx:82-126
const response = await GetEventMappings();
const eventData: EventMapping = response.data[0];
```

### Step 2: Filter Modules by Allowed Module IDs
```typescript
// Filter modules by allowed module IDs (Conference Only and Pre-Congress Workshop)
// Location: NonResidentialPackages.tsx:40-47
const ALLOWED_MODULE_IDS: number[] = [
  // Conference Only module ID
  // Pre-Congress Workshop module ID (e.g., 2)
  // Add specific module IDs here
];

// Filter modules by ID first, then filter non-residential categories
const filteredModules = ALLOWED_MODULE_IDS.length > 0
  ? eventData.modules.filter((module) => ALLOWED_MODULE_IDS.includes(module.id))
  : eventData.modules;

const nonResidentialModules = filteredModules
  .map((module) => ({
    ...module,
    categories: module.categories.filter((cat) => cat.is_residential === 0),
  }))
  .filter((module) => module.categories.length > 0);
```

**Key Points**:
- **Module filtering is ID-based**: Uses `ALLOWED_MODULE_IDS` array to filter by module ID
- **No module_name dependency**: Filtering is based on module IDs, not names
- **Non-residential filter**: Only categories with `is_residential === 0` are shown
- **If ALLOWED_MODULE_IDS is empty**: Shows all modules (backward compatible)

### Step 3: Display Modules as Tabs
- Each module becomes a tab button (displayed by `module.module_name` for UI)
- User can switch between modules (e.g., "Conference Only", "Pre-Congress Workshop")
- **Note**: Tab display uses `module_name`, but filtering uses `module.id`

### Step 4: Membership Type Selection
- User selects: **EFI Members** or **Non EFI Members**
- This selection is stored in `membershipType` state
- Default: `MEMBERSHIP_TYPES.MEMBER` (EFI Members)

### Step 5: Display Categories as Tabs
- Within each module, categories are displayed as tabs
- Example: "Early Bird", "Regular", "Pre-Conference Workshop"
- User can switch between categories

### Step 6: Display Tickets with Dynamic Pricing
```typescript
// Location: DynamicModuleContent.tsx:108-112
const price = membershipType === MEMBERSHIP_TYPES.MEMBER 
  ? ticket.member_price      // Show EFI Member price
  : ticket.non_member_price; // Show Non EFI Member price
```

**Key Points**:
- Same tickets are shown for both membership types
- Only the **price** changes based on `membershipType`
- Each ticket has both `member_price` and `non_member_price` from API

## How It Works for Pre-Conference Workshop

### Similar Structure
Pre-Conference Workshop tickets work **exactly the same way** as other conference tickets:

1. **Same API**: Uses `GetEventMappings()` - same endpoint
2. **Same Data Structure**: Pre-Conference Workshop is a `Category` within a `Module`
3. **Same Pricing Logic**: Has both `member_price` and `non_member_price`
4. **Same Display**: Shown in the same ticket list

### Differences for Pre-Conference Workshop

**View-Only Behavior** (in `DynamicModuleContent.tsx`):
```typescript
// Check if module is Pre-Congress Workshop based on module ID
// Location: DynamicModuleContent.tsx:123
const isPreConferenceWorkshop = module?.id == 2 ? true : false;

// Use View instead of TouchableOpacity (no clicking)
const CardComponent = isPreConferenceWorkshop ? View : TouchableOpacity;

// Hide arrow icon
{!isPreConferenceWorkshop && (
  <CardRightArrowIcon size={16} color={colors.darkGray} />
)}
```

**Key Points**:
- **ID-based detection**: Uses `module.id == 2` to identify Pre-Congress Workshop
- **No name matching**: Does not rely on category or module names
- **Module ID 2**: Currently hardcoded to module ID 2 (Pre-Congress Workshop)

**Result**:
- Pre-Congress Workshop tickets (module ID 2) are **view-only** (no navigation)
- No right arrow icon for Pre-Congress Workshop tickets
- Prices still show for both EFI Members and Non EFI Members
- User can still switch between membership types to see different prices
- All tickets in module ID 2 are non-clickable, regardless of category name

## Example API Response Structure

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "event_name": "EFI Annual Conference 2024",
      "description": "December 15-17, 2024 | Mumbai, India",
      "modules": [
        {
          "id": 1,
          "module_name": "Main Conference",
          "categories": [
            {
              "id": 1,
              "name": "Early Bird",
              "is_residential": 0,
              "tickets": [
                {
                  "id": 1,
                  "name": "Standard Ticket",
                  "member_price": 5000,
                  "non_member_price": 7000,
                  "currency": "INR"
                }
              ]
            }
          ]
        },
        {
          "id": 2,
          "module_name": "Pre-Conference Workshop",
          "categories": [
            {
              "id": 5,
              "name": "Pre-Conference Workshop",
              "is_residential": 0,
              "tickets": [
                {
                  "id": 10,
                  "name": "Workshop Ticket",
                  "member_price": 2000,
                  "non_member_price": 3000,
                  "currency": "INR"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

## Summary

1. **Single API Call**: `GetEventMappings()` fetches all conference data
2. **Module Filtering**: Uses `ALLOWED_MODULE_IDS` to filter by module ID (not module_name)
   - If `ALLOWED_MODULE_IDS` is empty, shows all modules
   - If populated, only shows modules with IDs in the array
3. **Category Filtering**: Only non-residential categories (`is_residential === 0`) are shown
4. **Dynamic Pricing**: Same tickets, different prices based on membership type selection
5. **Pre-Congress Workshop**: 
   - Identified by module ID (currently `module.id == 2`)
   - View-only behavior (no clicking, no arrow icon)
   - Same pricing structure as other tickets
6. **Membership Types**: User can toggle between EFI Members and Non EFI Members to see different prices
7. **All Tickets**: Both membership types see the same ticket list, only prices differ
8. **ID-Based Logic**: All filtering and detection uses IDs, not names

## Configuration

### Module IDs Configuration
To configure which modules are shown in Non-Residential Packages:

```typescript
// Location: NonResidentialPackages.tsx:40-47
const ALLOWED_MODULE_IDS: number[] = [
  1, // Conference Only module ID
  2, // Pre-Congress Workshop module ID
];
```

**To find module IDs**:
1. Check the API response from `GetEventMappings()`
2. Look at the `modules` array in the response
3. Find the `id` field for "Conference Only" and "Pre-Congress Workshop" modules
4. Add those IDs to `ALLOWED_MODULE_IDS`

### Pre-Congress Workshop Module ID
Currently hardcoded in `DynamicModuleContent.tsx`:
```typescript
// Location: DynamicModuleContent.tsx:123
const isPreConferenceWorkshop = module?.id == 2 ? true : false;
```

**Note**: Module ID 2 is currently used for Pre-Congress Workshop. Update this if your API uses a different ID.

## Key Files

- **API Service**: `src/services/staticService.ts` - `GetEventMappings()`
- **Main Component**: `src/pages/conference/NonResidentialPackages.tsx`
  - Module filtering by ID: Lines 40-47, 108-115
- **Ticket Display**: `src/pages/conference/ConferenceRegistrationContent/DynamicModuleContent.tsx`
  - Pre-Congress Workshop detection: Line 123 (module.id == 2)
- **Types**: `src/utils/conferenceTypes.ts`

