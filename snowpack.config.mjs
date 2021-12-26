import proxy from 'http2-proxy';


export default {

  root: "client/src",
  buildOptions : {
    out: "build"
  },
  optimize: {
    bundle: true,
    minify: true,
    target: 'es2018',
  },

  routes: [
    {
      src: '/peers',
      dest: (req, res) => {
        return proxy.web(req, res, {
          hostname: 'localhost',
          port: 3000
        })
      }
    },
    {
      src: '/ws',
      upgrade: (req, socket, head) => {
        const defaultWSHandler = (err, req, socket, head) => {
          if (err) {
            console.error('proxy error', err);
            socket.destroy();
          }
        };

        proxy.ws(
          req,
          socket,
          head,
          {
            hostname: 'localhost',
            port: 5000,
          },
          defaultWSHandler,
        );
      },
    }
  ]
};