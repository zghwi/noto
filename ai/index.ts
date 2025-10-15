import Gemini from "./client";

(async () => {
    
    const gemini = new Gemini();
    const test = await gemini.test();

    console.log(test);
})();