export {};

declare global {
    interface GlobalThis {
        __qunit_done__?: boolean;
        __qunit_results__?: QUnit.DoneDetails;
        __qunit_failures__?: QUnit.TestDoneDetails[];
    }
}
