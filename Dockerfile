# Use Playwright's official image which includes Node and browser dependencies
FROM mcr.microsoft.com/playwright:latest

LABEL org.opencontainers.image.title="csobjob-automation-demo"
LABEL org.opencontainers.image.description="Container image with Playwright tests for the ČSOB demo"

WORKDIR /workspace

# Copy package manifests first to leverage Docker layer caching for installs
COPY package.json package-lock.json ./

# Install project dependencies (including devDependencies where Playwright is usually declared)
RUN npm ci --no-audit --no-fund

# Copy the rest of the repository
COPY . .

# Ensure Playwright browsers and dependencies are installed (image may already include them,
# but this makes the image resilient if package versions change)
RUN npx playwright install --with-deps

# Default command runs Playwright tests. Users can override the command when running the container,
# e.g. `docker run --rm csobjob-automation-demo --headed` to run headed tests.
CMD ["npx", "playwright", "test"]

# Notes for users:
# - To run tests in headed mode and see the browser on your host X server:
#   docker run --rm -e DISPLAY=$DISPLAY -v /tmp/.X11-unix:/tmp/.X11-unix --shm-size=1g csobjob-automation-demo --headed
# - For Mac/Windows, consider using XQuartz or an X server and mapping DISPLAY appropriately.