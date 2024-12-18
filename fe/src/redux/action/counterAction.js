export const INCREMENT = "INCREMENT";

export const DECREMENT = "DECREMENT";

export const incrementCounter = () => {
    return {
        type: INCREMENT,
    };
};

export const decrementCounter = () => {
    return {
        type: DECREMENT,
    };
};
