/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { assert } from "chai";
import { mount, ReactWrapper } from "enzyme";
import * as React from "react";

import { IOverflowListProps, OverflowList } from "../../src/components/overflow-list/overflowList";

const ITEMS = [{}, {}, {}, {}, {}, {}];

const TestItem: React.SFC = () => <div style={{ width: 10 }} />;
const TestOverflow: React.SFC = () => <div />;

describe("<OverflowList>", () => {
    let list: ReactWrapper<IOverflowListProps<{}>, any> | undefined;
    const testsContainerElement = document.createElement("div");
    document.documentElement.appendChild(testsContainerElement);

    afterEach(() => {
        // clean up list after each test, if it was used
        if (list !== undefined) {
            list.unmount();
            list.detach();
            list = undefined;
        }
    });

    it("adds className to itself", () => {
        list = renderOverflowList({ className: "winner" });
        assert.lengthOf(list.find(".winner").hostNodes(), 1);
    });

    it("overflows correctly on initial mount", () => {
        list = renderOverflowList({ style: { width: 35 } });
        assert.lengthOf(list.find(TestItem), 3);
    });

    it("shows more after growing", () => {
        list = renderOverflowList({ style: { width: 35 } });
        assert.lengthOf(list.find(TestItem), 3);
        list.setProps({ style: { width: 45 } });
        list.update();
        assert.lengthOf(list.find(TestItem), 4);
    });

    it("shows all after growing", () => {
        list = renderOverflowList({ style: { width: 15 } });
        assert.lengthOf(list.find(TestItem), 1);
        list.setProps({ style: { width: 200 } });
        list.update();
        assert.lengthOf(list.find(TestItem), ITEMS.length);
    });

    it("shows fewer after shrinking", () => {
        list = renderOverflowList({ style: { width: 45 } });
        assert.lengthOf(list.find(TestItem), 4);
        list.setProps({ style: { width: 15 } });
        list.update();
        assert.lengthOf(list.find(TestItem), 1);
    });

    it("does not render the overflow if all items are displayed", () => {
        list = renderOverflowList();
        assert.lengthOf(list.find(TestOverflow), 0);
    });

    it("renders the overflow if not all items are displayed", () => {
        list = renderOverflowList({ style: { width: 45 } });
        assert.lengthOf(list.find(TestOverflow), 1);
    });

    function renderOverflow(): React.ReactNode {
        return <TestOverflow />;
    }

    function renderItem() {
        return <TestItem />;
    }

    function renderOverflowList(props?: Partial<IOverflowListProps<{}>>) {
        return mount(
            <OverflowList
                items={ITEMS}
                overflowRenderer={renderOverflow}
                visibleItemRenderer={renderItem}
                {...props}
            />,
            // measuring elements only works in the DOM, so this element actually needs to be attached
            { attachTo: testsContainerElement },
        );
    }
});