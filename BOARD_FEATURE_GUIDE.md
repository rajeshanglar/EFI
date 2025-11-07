# Board Feature Implementation Guide

## 📋 Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Component Structure](#component-structure)
3. [How It Works](#how-it-works)
4. [Navigation System](#navigation-system)
5. [How to Add New Pages/Links](#how-to-add-new-pageslinks)
6. [Code Flow Explanation](#code-flow-explanation)

---

## 🏗️ Architecture Overview

The Board feature follows a **component-based architecture** with these key principles:

```
Board Page (Main Container)
├── Header Component (Navigation)
├── Tab Navigation (EFI Board, Advisory Board, Voluntary Team)
├── Content Components (Dynamic based on active tab)
│   ├── EFIBoardContent
│   ├── AdvisoryBoardContent
│   └── VoluntaryTeamContent
└── BoardMemberModal (Pop-up for member details)
```

---

## 📦 Component Structure

### 1. **Board.tsx** (Main Container)
**Location:** `src/pages/board/Board.tsx`

**Purpose:** Main container that manages:
- Tab state (which tab is active)
- Modal state (which member is selected)
- Navigation callbacks

**Key Features:**
```typescript
// State Management
const [activeTab, setActiveTab] = useState<TabKey>('efiBoard');
const [selectedMember, setSelectedMember] = useState<BoardMemberData | null>(null);
const [isModalVisible, setIsModalVisible] = useState(false);

// Dynamic Content Loading
const Content = useMemo(() => tabContentMap[activeTab], [activeTab]);

// Member Click Handler
const handleMemberPress = (member: BoardMemberData) => {
  setSelectedMember(member);      // Store selected member
  setIsModalVisible(true);        // Show modal
};
```

### 2. **BoardMemberModal.tsx** (Modal Component)
**Location:** `src/components/BoardMemberModal.tsx`

**Purpose:** Displays detailed member information in a popup modal

**Structure:**
- **Header Section:** Dark blue background with name, role, accreditations
- **Body Section:** White background with scrollable biography

**Props:**
```typescript
interface BoardMemberModalProps {
  visible: boolean;           // Controls modal visibility
  member: BoardMemberData | null;  // Member data to display
  onClose: () => void;       // Callback to close modal
}
```

### 3. **Content Components** (EFIBoardContent, AdvisoryBoardContent, VoluntaryTeamContent)
**Location:** `src/pages/board/[ComponentName].tsx`

**Purpose:** Display member cards in a grid layout

**Key Features:**
- Receives `onMemberPress` callback from parent
- Maps through member data to create cards
- Each card is clickable and triggers the modal

---

## 🔄 How It Works

### Step-by-Step Flow:

1. **User clicks on a member card**
   ```typescript
   // In EFIBoardContent.tsx
   <TouchableOpacity onPress={() => onMemberPress?.(member)}>
   ```

2. **Callback propagates to Board component**
   ```typescript
   // In Board.tsx
   <Content onMemberPress={handleMemberPress} />
   ```

3. **Board component stores member and shows modal**
   ```typescript
   const handleMemberPress = (member: BoardMemberData) => {
     setSelectedMember(member);      // Store member data
     setIsModalVisible(true);        // Show modal
   };
   ```

4. **Modal displays member information**
   ```typescript
   <BoardMemberModal
     visible={isModalVisible}
     member={selectedMember}
     onClose={handleCloseModal}
   />
   ```

5. **User closes modal**
   ```typescript
   const handleCloseModal = () => {
     setIsModalVisible(false);       // Hide modal
     setSelectedMember(null);         // Clear member data
   };
   ```

### Data Flow Diagram:
```
Member Card Click
    ↓
onMemberPress(member)
    ↓
handleMemberPress()
    ↓
setSelectedMember(member) + setIsModalVisible(true)
    ↓
BoardMemberModal renders with member data
    ↓
User clicks close button
    ↓
handleCloseModal()
    ↓
setIsModalVisible(false) + setSelectedMember(null)
```

---

## 🧭 Navigation System

### How Navigation Works

The app uses a **custom navigation manager** instead of React Navigation. Here's how it works:

### 1. **Navigation Manager Hook**
**Location:** `src/hooks/use-navigation-manager.ts`

```typescript
export function useNavigationManager() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');

  const navigate = {
    home: () => setCurrentPage('home'),
    board: () => setCurrentPage('board'),
    conference: () => setCurrentPage('conference'),
    // ... more navigation methods
  };

  return { currentPage, navigate };
}
```

### 2. **Page Type Definition**
All available pages must be defined in the `PageType` union:

```typescript
export type PageType =
  | 'login'
  | 'home'
  | 'board'           // ← Board page
  | 'conference'
  | 'trainingPrograms'
  // ... more pages
```

### 3. **App Navigation Component**
**Location:** `src/navigation/app-navigation.tsx`

This component:
- Uses the navigation manager hook
- Maps `currentPage` to actual React components
- Handles page rendering

```typescript
const pages: Record<string, JSX.Element> = {
  home: <HomePage onNavigateToBoard={navigate.board} />,
  board: <Board onBack={navigate.home} onNavigateToHome={navigate.home} />,
  // ... more pages
};

return <>{pages[currentPage] || <HomePage />}</>;
```

---

## 🔗 How to Add New Pages/Links

### Step 1: Create Your Page Component

```typescript
// src/pages/my-new-page/MyNewPage.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Header } from '../../components/Header';

interface MyNewPageProps {
  onBack: () => void;
  onNavigateToHome: () => void;
}

export const MyNewPage: React.FC<MyNewPageProps> = ({
  onBack,
  onNavigateToHome,
}) => {
  return (
    <View>
      <Header
        title="My New Page"
        onBack={onBack}
        onNavigateToHome={onNavigateToHome}
      />
      <Text>My New Page Content</Text>
    </View>
  );
};

export default MyNewPage;
```

### Step 2: Add Page Type

**File:** `src/hooks/use-navigation-manager.ts`

```typescript
export type PageType =
  | 'login'
  | 'home'
  | 'board'
  | 'myNewPage'  // ← Add your new page type
```

### Step 3: Add Navigation Method

**File:** `src/hooks/use-navigation-manager.ts`

```typescript
const navigate = {
  home: () => setCurrentPage('home'),
  board: () => setCurrentPage('board'),
  myNewPage: () => setCurrentPage('myNewPage'),  // ← Add navigation method
};
```

### Step 4: Register Page in App Navigation

**File:** `src/navigation/app-navigation.tsx`

```typescript
// 1. Import your component
import MyNewPage from '../pages/my-new-page/MyNewPage';

// 2. Add to pages object
const pages: Record<string, JSX.Element> = {
  home: <HomePage onNavigateToMyNewPage={navigate.myNewPage} />,
  myNewPage: (
    <MyNewPage
      onBack={navigate.home}
      onNavigateToHome={navigate.home}
    />
  ),
};
```

### Step 5: Add Link from Existing Page

**Example: Adding link from HomePage**

**File:** `src/pages/home/home.tsx`

```typescript
// 1. Add prop to interface
interface HomePageProps {
  onNavigateToMyNewPage?: () => void;  // ← Add this
}

// 2. Add to component props
const HomePage: React.FC<HomePageProps> = ({
  onNavigateToMyNewPage,  // ← Add this
}) => {
  // 3. Use in button/card
  <TouchableOpacity onPress={onNavigateToMyNewPage}>
    <Text>Go to My New Page</Text>
  </TouchableOpacity>
};

// 4. Update app-navigation.tsx
home: (
  <HomePage
    onNavigateToMyNewPage={navigate.myNewPage}  // ← Add this
  />
),
```

### Step 6: Add Menu Item (Optional)

**File:** `src/pages/home/home.tsx`

```typescript
const handleMenuItemPress = (itemId: string) => {
  switch (itemId) {
    case 'myNewPage':  // ← Add case
      onNavigateToMyNewPage?.();
      setIsMenuVisible(false);
      break;
    // ... other cases
  }
};
```

**File:** `src/components/SlideOutMenu.tsx`

```typescript
const menuItems: MenuItem[] = [
  { id: 'home', title: 'Home', icon: HomeIcon },
  { id: 'myNewPage', title: 'My New Page', icon: SomeIcon },  // ← Add menu item
  // ... other items
];
```

---

## 🔍 Code Flow Explanation

### Complete Flow Example: Navigating to Board Page

#### 1. **User clicks "View All" button in EfiBoard component**

```typescript
// src/components/EfiBoard.tsx
<TouchableOpacity onPress={onViewAll}>
  <Text>View All</Text>
</TouchableOpacity>
```

#### 2. **HomePage receives callback**

```typescript
// src/pages/home/home.tsx
<EfiBoard onViewAll={onNavigateToBoard} />

// Where onNavigateToBoard comes from props:
interface HomePageProps {
  onNavigateToBoard?: () => void;
}
```

#### 3. **Navigation manager updates current page**

```typescript
// src/navigation/app-navigation.tsx
const HomePage = (
  <HomePage
    onNavigateToBoard={navigate.board}  // ← This calls navigate.board()
  />
);

// navigate.board() is defined in use-navigation-manager.ts:
board: () => setCurrentPage('board'),
```

#### 4. **App Navigation renders Board page**

```typescript
// src/navigation/app-navigation.tsx
const pages: Record<string, JSX.Element> = {
  board: (
    <Board
      onBack={navigate.home}
      onNavigateToHome={navigate.home}
    />
  ),
};

return <>{pages[currentPage] || <HomePage />}</>;
```

#### 5. **Board page renders with tabs**

```typescript
// src/pages/board/Board.tsx
const [activeTab, setActiveTab] = useState<TabKey>('efiBoard');

// User clicks tab
<TouchableOpacity onPress={() => setActiveTab('advisoryBoard')}>
  <Text>Advisory Board</Text>
</TouchableOpacity>
```

#### 6. **User clicks member card**

```typescript
// src/pages/board/EFIBoardContent.tsx
<TouchableOpacity onPress={() => onMemberPress?.(member)}>
  {/* Member card content */}
</TouchableOpacity>
```

#### 7. **Modal opens with member details**

```typescript
// src/pages/board/Board.tsx
const handleMemberPress = (member: BoardMemberData) => {
  setSelectedMember(member);      // Store member
  setIsModalVisible(true);        // Show modal
};

// Modal renders
<BoardMemberModal
  visible={isModalVisible}
  member={selectedMember}
  onClose={handleCloseModal}
/>
```

---

## 📝 Key Concepts

### 1. **Props Drilling Pattern**
Data flows down through props:
```
AppNavigation → HomePage → EfiBoard → TouchableOpacity
```

### 2. **Callback Pattern**
Events flow up through callbacks:
```
TouchableOpacity → onPress → onViewAll → onNavigateToBoard → navigate.board()
```

### 3. **State Management**
- **Local State:** `useState` for component-specific data
- **Shared State:** Navigation manager hook for page navigation
- **Modal State:** Managed in parent component (Board.tsx)

### 4. **Dynamic Component Rendering**
```typescript
// Using useMemo to optimize content switching
const Content = useMemo(() => tabContentMap[activeTab], [activeTab]);

// Renders different component based on activeTab
<Content onMemberPress={handleMemberPress} />
```

---

## 🎯 Best Practices

### 1. **Always Define Types**
```typescript
interface PageProps {
  onBack: () => void;
  onNavigateToHome: () => void;
}
```

### 2. **Use Optional Chaining**
```typescript
onMemberPress?.(member)  // Safe if prop is undefined
```

### 3. **Keep Components Focused**
- Board.tsx: Manages state and layout
- Content components: Display data only
- Modal: Handles display logic

### 4. **Pass Callbacks Through Props**
```typescript
// Good: Explicit callback
<Component onAction={handleAction} />

// Bad: Direct navigation in child
<Component navigate={navigate} />
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Navigation not working
**Solution:** Ensure you've added the page type, navigation method, and registered it in app-navigation.tsx

### Issue 2: Modal not showing
**Solution:** Check that `isModalVisible` state is being set to `true` and member data is not null

### Issue 3: Callback not firing
**Solution:** Verify props are being passed correctly through the component tree

---

## 📚 Summary

1. **Navigation:** Use `navigate.pageName()` from navigation manager
2. **State:** Use `useState` for component-specific state
3. **Callbacks:** Pass callbacks through props to handle events
4. **Modals:** Manage modal state in parent component
5. **Types:** Always define TypeScript interfaces for props

This architecture provides a clean, maintainable way to handle navigation and component interactions in your React Native app!

