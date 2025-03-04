# Technical Design Document for Bookmark Manager

## Overview
The Bookmark Manager web app is built with Angular and provides users the ability to add, edit, and delete bookmark URLs. The app features two main pages:
- **Overview Page:** Displays a submission form (with custom URL validation) and a paginated list of bookmarks.
- **Results Page:** Thanks the user for their submission and displays the most recent bookmark.
- **Modern UI** Implemented some styles to make the UI look more modern and provide UI feedback such as duplicate checks and whether an invalid URL was provided. 

## Design Decisions
- **Framework:** Angular was chosen for its component-based architecture.
- **Data Persistence:** All bookmarks are stored in the browser's localStorage so that data persists across page reloads.
- **Form Validation:** To validate the URL, an external library was used. Although this could have been done from scratch, utilizing a library that already does validation for links is beneficial.
- **Pagination:** Client-side pagination displays 3 bookmarks per page with numbered navigation and previous/next controls.
- **Routing:** Angular Router manages navigation between the overview and results pages.

## Limitations
- **URL Existence Check:** Simply checks if the URL is valid in terms of format. I could utilise HTTP request to get a response from the server however, there is further impllications for that with CORS.
- **No Backend:** Using localStorage ties the data to a single browser and device.
- **Scalability:** While suitable for a moderate number of bookmarks, client-side pagination may need rethinking for very large datasets.

## Additional Features
- **Edit and Delete:** Users can update or remove bookmarks directly from the overview page.
- **User Feedback:** After a successful submission, users are directed to a results page that confirms their submission.

## Conclusion
This design demonstrates an Angular application that meets all requirements while following best practices in code structure, validation, and user experience.
