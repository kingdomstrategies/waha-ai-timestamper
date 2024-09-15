# TimestampAudio.com - Front End

![TimestampAudio.com Logo](./logo.png  "TimestampAudio.com Logo")

The [TimeStampAudio.com](https://timestampaudio.com) web app generates timing data from
any audio and corresponding text file, in the over [1,100
languages](https://dl.fbaipublicfiles.com/mms/misc/language_coverage_mms.html) supported
by [Meta's MMS ASR
model](https://ai.meta.com/blog/multilingual-model-speech-recognition/), outputting the
results in JSON and SRT.

## Built With

- **Next.js** Server-side rendering and static site generation
- **React** Component-based UI
- **TailwindCSS** Utility-first CSS framework
- **Vercel**: Deployment

## Installation

To get started with the frontend, clone the repository and install dependencies:

```bash
git clone https://github.com/kingdomstrategies/waha-ai-timestamper.git
cd waha-ai-timestamper
yarn
```

## Set up Backend

To use your own backend, update `baseUrl` in `constants.ts` to whatever url you deployed
your backend to.

```ts
// export const baseUrl = 'https://api.timestampaudio.com:443' // Remove this
export const baseUrl = 'https://your.backeknd.api.com:111'
```

## Usage

After installation, you can run the development server:

```bash
yarn dev
```

The app will be available at http://localhost:3000.

## Testing the App

1. After opening the app, click "try it out" in the upper right corner to go to the
timestamper portion of the site.
2. Click "download sample files" to download a zip containing sample mp3 and txt files you can use for testing.
3. Extract the zip to reveal the 2 sample files.
4. Drag and drop (or click browse and select) the sample files you just downloaded.
5. The app will automatically detect the language of the files.
6. Click "timestamp" and let the magic happen!
7. Once it's finished, download your data as `json` or `srt` depending on your needs.
8. Scroll down to check out the potential use cases of this data.

## Contributing

If you’d like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcome.

## License

This project is licensed under the GNU License.