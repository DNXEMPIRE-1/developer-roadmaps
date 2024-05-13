const fs = require('fs');
const path = require('path');

const OPEN_AI_API_KEY = process.env.OPEN_AI_API_KEY;
const ALL_BEST_PRACTICES_DIR = path.join(
  __dirname,
  '../src/data/best-practices',
);

const bestPracticeId = process.argv[2];
const bestPracticeTitle = bestPracticeId.replace(/-/g, ' ');

const allowedBestPracticeIds = fs.readdirSync(ALL_BEST_PRACTICES_DIR);
if (!bestPracticeId) {
  console.error('bestPracticeId is required');
  process.exit(1);
}

if (!allowedBestPracticeIds.includes(bestPracticeId)) {
  console.error(`Invalid bestPractice key ${bestPracticeId}`);
  console.error(`Allowed keys are ${allowedBestPracticeIds.join(', ')}`);
  process.exit(1);
}

const BEST_PRACTICE_CONTENT_DIR = path.join(
  ALL_BEST_PRACTICES_DIR,
  bestPracticeId,
  'content',
);
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: OPEN_AI_API_KEY,
});

function getFilesInFolder(folderPath, fileList = {}) {
  const files = fs.readdirSync(folderPath);

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      getFilesInFolder(filePath, fileList);
    } else if (stats.isFile()) {
      const fileUrl = filePath
        .replace(BEST_PRACTICE_CONTENT_DIR, '') // Remove the content folder
        .replace(/\/\d+-/g, '/') // Remove ordering info `/101-ecosystem`
        .replace(/\/index\.md$/, '') // Make the `/index.md` to become the parent folder only
        .replace(/\.md$/, ''); // Remove `.md` from the end of file

      fileList[fileUrl] = filePath;
    }
  });

  return fileList;
}

function writeTopicContent(topicTitle) {
  let prompt = `I will give you a topic and you need to write a brief paragraph with examples (if possible) about why it is important for the "${bestPracticeTitle}". Just reply to the question without adding any other information about the prompt and use simple language. Also do not start your sentences with "XYZ is important because..". Your format should be as follows:

# (Put a heading for the topic)

(Write a brief paragraph about why it is important for the "${bestPracticeTitle})
 
First topic is: ${topicTitle}`;

  console.log(`Generating '${topicTitle}'...`);

  return new Promise((resolve, reject) => {
    openai.chat.completions
      .create({
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      })
      .then((response) => {
        const article = response.choices[0].message.content;

        resolve(article);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

async function writeFileForGroup(group, topicUrlToPathMapping) {
  const topicId = group?.properties?.controlName;
  const topicTitle = group?.children?.controls?.control
    ?.filter((control) => control?.typeID === 'Label')
    .map((control) => control?.properties?.text)
    .join(' ')
    .toLowerCase();

  const currTopicUrl = `/${topicId}`;
  if (currTopicUrl.startsWith('/check:')) {
    return;
  }

  const contentFilePath = topicUrlToPathMapping[currTopicUrl];

  if (!contentFilePath) {
    console.log(`Missing file for: ${currTopicUrl}`);
    return;
  }

  const currentFileContent = fs.readFileSync(contentFilePath, 'utf8');
  const isFileEmpty = currentFileContent.replace(/^#.+/, ``).trim() === '';

  if (!isFileEmpty) {
    console.log(`Ignoring ${topicId}. Not empty.`);
    return;
  }

  let newFileContent = `# ${topicTitle}`;

  if (!OPEN_AI_API_KEY) {
    console.log(`Writing ${topicId}..`);

    fs.writeFileSync(contentFilePath, newFileContent, 'utf8');
    return;
  }

  if (!topicTitle) {
    console.log(`Skipping ${topicId}. No title.`);
    return;
  }

  const topicContent = await writeTopicContent(topicTitle);
  newFileContent = `${topicContent}`;

  console.log(`Writing ${topicId}..`);
  fs.writeFileSync(contentFilePath, newFileContent, 'utf8');

  // console.log(currentFileContent);
  // console.log(currTopicUrl);
  // console.log(topicTitle);
  // console.log(topicUrlToPathMapping[currTopicUrl]);
}

async function run() {
  const topicUrlToPathMapping = getFilesInFolder(BEST_PRACTICE_CONTENT_DIR);

  const bestPracticeJson = require(
    path.join(ALL_BEST_PRACTICES_DIR, `${bestPracticeId}/${bestPracticeId}`),
  );

  const groups = bestPracticeJson?.mockup?.controls?.control?.filter(
    (control) =>
      control.typeID === '__group__' &&
      !control.properties?.controlName?.startsWith('ext_link'),
  );

  if (!OPEN_AI_API_KEY) {
    console.log('----------------------------------------');
    console.log('OPEN_AI_API_KEY not found. Skipping openai api calls...');
    console.log('----------------------------------------');
  }

  const writePromises = [];
  for (let group of groups) {
    writePromises.push(writeFileForGroup(group, topicUrlToPathMapping));
  }

  console.log('Waiting for all files to be written...');
  await Promise.all(writePromises);
}

run()
  .then(() => {
    console.log('Done');
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
