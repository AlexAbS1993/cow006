import { howBadPoints } from "../../Instruments/Creators/CardList.creator"

describe("BadPointsDefineder goes with gaming rules and returns current bad points", () => {
    test('It returns a number', () => {
        expect(typeof howBadPoints(1)).toBe("number")
    })
    test("It returns current value with differents points", () => {
        expect(howBadPoints(1)).toBe(1)
        expect(howBadPoints(55)).toBe(7)
        expect(howBadPoints(15)).toBe(2)
        expect(howBadPoints(50)).toBe(3)
        expect(howBadPoints(11)).toBe(5)
        expect(howBadPoints(103)).toBe(1)
    })
    test("It throws an error with uncorrect entry number", () => {
        expect(howBadPoints.bind(howBadPoints, -10)).toThrow("Требуется число выше 0")
        expect(howBadPoints.bind(howBadPoints, 5.2)).toThrow("Требуется целое число")
    })
})