# My Personal Blog [![Netlify Status](https://api.netlify.com/api/v1/badges/bdbb0d4a-06fe-4acd-8117-18e4957cc978/deploy-status)](https://app.netlify.com/sites/doganozturk/deploys)

This is my blog which I recently rewrote using [Qwik-City](https://qwik.builder.io/qwikcity/overview/). [My old blog](https://github.com/doganozturk/blog) had a straightforward setup; I especially like the idea of a minor CSS & JS footprint, inlining these resources for high [pagespeed](https://developers.google.com/speed/pagespeed/insights/?url=https://doganozturk.dev) performance. Qwik and Qwik-City give me even better results with many more features and a better developer experience.

## Local Development

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

If you want to set up a development environment for the project , you need these:

```
brew install node@18.12.1
```

\*Note: Especially for Node, I strongly recommend usage of a Node version management tool such as [Volta](https://volta.sh).

### Installing

```
git clone https://github.com/doganozturk/blog-qwik.git

cd blog-qwik

# Install project dependencies
npm install

# Start local dev environment
npm start
```

## Author

- **Doğan Öztürk** - [Github](https://github.com/doganozturk)
