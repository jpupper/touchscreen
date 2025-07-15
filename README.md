# TouchScreen.js - Touch Control Library

A specialized JavaScript library for controlling touch behavior and zoom functionality in web applications, particularly useful for kiosk-mode and touch-screen interfaces.

## Core Features

- Prevents multi-touch gestures (like pinch-to-zoom)
- Disables user scaling
- Adds fullscreen button functionality
- Prevents text selection on touch devices
- Automatically propagates touch parameters to all links
- Blocks context menus on touch devices

## Implementation

1. Include the script in your HTML:
```html
<script src="touchscreen.js"></script>
```

2. Activate the functionality by adding `touchversion=true` to your URL:
```
https://yoursite.com/page.html?touchversion=true
```

## How It Works

When the URL includes `touchversion=true`, the script automatically:
- Prevents multi-touch gestures
- Adds meta tags to disable user scaling
- Shows a fullscreen button in the top-right corner
- Prevents context menus and text selection
- Propagates the touch parameter to all HTML links

## Demo

1. Place files in your web server directory
2. Access: `http://localhost/configuraciontouch/`
3. Click the "Enable Touch Restrictions" link to test the functionality

## Requirements

- Web server (Apache, XAMPP, etc.)
- Modern web browser with JavaScript enabled

## Testing

To test the functionality:
1. Open the demo page
2. Click the "Enable Touch Restrictions" link or add `?touchversion=true` to the URL
3. Try to use multi-touch gestures (they should be blocked)
4. Notice the fullscreen button in the top-right corner
5. Observe that text selection is disabled


Coded(prompted ) by ErebusAngelo