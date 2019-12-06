import Plugin from "../src";

describe("Connected Components Vue Plugin", () => {
    test("MyButton.vue snippet creation", async () => {
        const processor = new Plugin();

        const componentCode = await processor.process(
            {
                path: "test/samples/MyButton.vue",
                zeplinNames: []
            }
        );

        expect(componentCode).toMatchSnapshot();
    });

    test("MyIcon.vue snippet creation", async () => {
        const processor = new Plugin();

        const componentCode = await processor.process(
            {
                path: "test/samples/MyIcon.vue",
                zeplinNames: []
            }
        );

        expect(componentCode).toMatchSnapshot();
    });
});
