/**
 * Smoothly scrolls the window to the target Y position over a specified duration.
 * @param {number} targetY - The vertical position to scroll to.
 * @param {number} duration - The duration of the scroll animation in milliseconds.
 */
export const smoothScrollTo = (targetY, duration = 1500) => {
    const startY = window.scrollY;
    const difference = targetY - startY;
    let startTime = null;

    const easeInOutQuad = (t) => {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    };

    const animation = (currentTime) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = easeInOutQuad(progress);

        window.scrollTo(0, startY + difference * ease);

        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    };

    requestAnimationFrame(animation);
};

/**
 * Smoothly scrolls an element into view with an offset.
 * @param {string} elementId - The ID of the element to scroll to.
 * @param {number} offset - Offset from the top (e.g., for sticky header).
 * @param {number} duration - Duration in ms.
 */
export const smoothScrollToElement = (elementId, offset = 0, duration = 1500) => {
    const element = document.getElementById(elementId);
    if (element) {
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - offset;
        smoothScrollTo(offsetPosition, duration);
    }
};
