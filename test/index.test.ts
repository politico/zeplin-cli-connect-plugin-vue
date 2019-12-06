import Plugin from "../src";

describe("Connected Components React Plugin - Flow", () => {
    test("FlowComponent.jsx snippet creation", async () => {
        const processor = new Plugin();

        const componentCode = await processor.process(
            {
                path: "test/samples/flow/FlowComponent.jsx",
                zeplinNames: []
            }
        );

        expect(componentCode).toMatchSnapshot();
    });

    test("FlowComponentWithProps.jsx snippet creation", async () => {
        const processor = new Plugin();

        const componentCode = await processor.process(
            {
                path: "test/samples/flow/FlowComponentWithProps.jsx",
                zeplinNames: []
            }
        );

        expect(componentCode).toMatchSnapshot();
    });

    test("FlowComponentWithChildren.jsx snippet creation", async () => {
        const processor = new Plugin();

        const componentCode = await processor.process(
            {
                path: "test/samples/flow/FlowComponentWithChildren.jsx",
                zeplinNames: []
            }
        );

        expect(componentCode).toMatchSnapshot();
    });

    test("FlowComponentWithChildrenAndProps.jsx snippet creation", async () => {
        const processor = new Plugin();

        const componentCode = await processor.process(
            {
                path: "test/samples/flow/FlowComponentWithChildrenAndProps.jsx",
                zeplinNames: []
            }
        );

        expect(componentCode).toMatchSnapshot();
    });
});
