(function() {
  // Prevent duplicate initialization
  if (window.__plumbify_widget_initialized) return;
  window.__plumbify_widget_initialized = true;

  // Auto-detect host domain from the current script source URL
  const currentScript = document.currentScript;
  const scriptSrc = currentScript ? currentScript.src : "http://localhost:3000/widget.js";
  let hostOrigin = "http://localhost:3000";
  try {
    hostOrigin = new URL(scriptSrc).origin;
  } catch (e) {
    console.error("[Plumbify Widget] Failed to parse script origin:", e);
  }

  // Create iframe element
  const iframe = document.createElement("iframe");
  iframe.src = `${hostOrigin}/widget-embed`;
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = "none";
  iframe.style.background = "transparent";
  iframe.style.colorScheme = "dark";
  iframe.setAttribute("allow", "microphone; autoplay");

  // Create outer container element
  const container = document.createElement("div");
  container.id = "plumbify-widget-container";
  
  // Set initial styling (collapsed state)
  const collapsedStyles = {
    position: "fixed",
    bottom: "12px",
    right: "12px",
    width: "90px",
    height: "90px",
    zIndex: "999999",
    background: "transparent",
    overflow: "hidden",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    borderRadius: "2rem"
  };

  Object.assign(container.style, collapsedStyles);
  container.appendChild(iframe);
  document.body.appendChild(container);

  // Responsive expand logic based on window dimensions
  function getExpandedStyles() {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      return {
        bottom: "0",
        right: "0",
        width: "100vw",
        height: "100vh",
        borderRadius: "0"
      };
    } else {
      return {
        bottom: "12px",
        right: "12px",
        width: "780px",
        height: "540px",
        borderRadius: "2rem"
      };
    }
  }

  // Listen for resize messages from the React component inside the iframe
  window.addEventListener("message", function(event) {
    // Check message integrity (optional check: if (event.origin !== hostOrigin) return;)
    const data = event.data;
    if (data && data.type === "plumbify-widget-state") {
      if (data.isOpen) {
        // Expand iframe container
        const expandedStyles = getExpandedStyles();
        Object.assign(container.style, expandedStyles);
      } else {
        // Collapse iframe container
        Object.assign(container.style, collapsedStyles);
      }
    }
  });

  // Handle parent window resizing dynamically if the widget is already open
  window.addEventListener("resize", function() {
    if (container.style.width !== collapsedStyles.width) {
      const expandedStyles = getExpandedStyles();
      Object.assign(container.style, expandedStyles);
    }
  });
})();
