import Hand from '../hand';
import { isSorted, shuffle } from '../arr';

describe('Hand', (): void => {
    const withoutUuid = (hand: Hand): object => ({
        'rank': hand.rank,
        'cards': hand.cards
    });

    describe('toString', (): void => {
        it('solves hands correctly', (): void => {
            const hands = require('./hand-testdata.json').strings;
            let str;
            for(let i = 0; i < hands.length; i++) {
                str = Hand.solve(hands[i].cards).toString();
                expect(str).toEqual(hands[i].string);
            }
        });
    });
    describe('solve', (): void => {
        it('solves hands correctly', (): void => {
            const hands = require('./hand-testdata.json').hands;
            let solved;
            for(let i = 0; i < hands.length; i++) {
                solved = Hand.solve(hands[i].cards);
                expect(solved.rank).toEqual(hands[i].rank);
            }
        });
    });
    describe('solveHoldEm', (): void => {
        it('solves Texas hold em hands', (): void => {
            expect(
                withoutUuid(Hand.solveHoldEm([1, 2, 3, 5, 6], [4, 13]))
            ).toEqual(
                withoutUuid(Hand.solve([2, 3, 5, 6, 4]))
            );
            expect(
                withoutUuid(Hand.solveHoldEm([1, 2, 3, 5, 6], [4, 13]))
            ).toEqual(
                withoutUuid(Hand.solve([1, 2, 3, 5, 6, 4, 13]))
            );
        });
        it('solves Omaha hold em hands', (): void => {
            expect(
                withoutUuid(Hand.solveHoldEm([1, 2, 3, 5, 6], [4, 12, 11, 10], 2))
            ).toEqual(
                withoutUuid(Hand.solve([12, 11, 6, 5, 3]))
            );
            expect(
                Hand.solveHoldEm([0, 13, 26, 39, 6], [12, 7, 4, 2], 2).rank
            ).toEqual(Hand.Rank.ThreeOfAKind);
        });
    });
    describe('compare', (): void => {
        it('can be used to sort hands from high to low', (): void => {
            const hands = require('./hand-testdata.json').hands;
            expect(isSorted(hands, Hand.compare)).toEqual(true);
            shuffle(hands);
            expect(isSorted(hands, Hand.compare)).toEqual(false);
            hands.sort(Hand.compare);
            expect(isSorted(hands, Hand.compare)).toEqual(true);
        });
    });
    describe('winners', (): void => {
        it('returns the winning hands', (): void => {
            const hands = [
                Hand.solve([1, 2, 3, 4, 5, 12, 13]),
                Hand.solve([1, 2, 3, 4, 5, 7, 8]),
                Hand.solve([1, 2, 3, 4, 7, 12, 13]),
                Hand.solve([1, 2, 3, 5, 6, 12, 13]),
            ];
            expect(Hand.winners(...hands)).toEqual([hands[0], hands[1]]);
        });
    });
    describe('max', (): void => {
        it('returns the largest of the inputs', (): void => {
            expect(withoutUuid(Hand.max(
                Hand.solve([1, 2, 4, 5, 6]),
                Hand.solve([1, 3, 4, 5, 6])
            ))).toEqual(
                withoutUuid(Hand.solve([1, 3, 4, 5, 6]))
            );
            expect(withoutUuid(Hand.max(
                Hand.solve([1, 2, 4, 5, 6]),
                Hand.solve([1, 3, 4, 5, 6]),
                Hand.solve([1, 4, 5, 6, 7])
            ))).toEqual(
                withoutUuid(Hand.solve([1, 4, 5, 6, 7]))
            );
        });
    });
    /*
    describe('fillWithKickers', () : void => {
        it('fill hand to match required number of cards', () : void => {
            const cards = [1, 2, 3, 3 + 13, 3 + 2 * 13, 7, 8];
            const cardsIncluded = [3, 3 + 13, 3 + 2 * 13];
            expect(Hand.fillWithKickers(cardsIncluded, cards)).toEqual([3, 3 + 13, 3 + 2 * 13, 8, 7]);
        });
    });
    */
    describe('isNumOfAKind', (): void => {
        it('returns false when no N of a kind in input array', (): void => {
            const cardsIn = [0, 1 + 13, 2 + 2 * 13, 3 + 3 * 13, 4, 5];
            expect(Hand.isNumOfAKind(2, cardsIn)).toEqual(false);
        });
        it('returns included cards when N of a kind in input array', (): void => {
            const cardsIn = [0, 1, 1 + 13, 1 + 2 * 13, 2];
            for (let i = 1; i < 5; i++) {
                cardsIn.push(2+13*i);
                const a = (i >= 2) ? 2 : 1;
                expect(Hand.isNumOfAKind(3, cardsIn)).toEqual([...Array(Math.max(3, i + 1)).keys()].map((b: number): number => a + b * 13));
            }
        });
    });
    describe('isStraightFlush', (): void => {
        it('returns false when no straight flush in input array', (): void => {
            const cardsIn = [0, 1 + 13, 2, 3, 4, 5];
            expect(Hand.isStraightFlush(cardsIn)).toEqual(false);
        });
        it('returns included cards when straight flush in input array', (): void => {
            const cardsIn = [2, 13, 14, 15, 16, 17];
            expect(Hand.isStraightFlush(cardsIn)).toEqual([17, 16, 15, 14, 13]);
        });
    });
    describe('isFullHouse', (): void => {
        it('returns false when no full house in input array', (): void => {
            const cardsIn = [0, 1 + 13, 1 + 2 * 13, 2 + 3 * 13, 3, 4];
            expect(Hand.isFullHouse(cardsIn)).toEqual(false);
            cardsIn.push(1);
            expect(Hand.isFullHouse(cardsIn)).toEqual(false);
        });
        it('returns included cards when full house in input array', (): void => {
            const cardsIn = [0, 1, 1 + 13, 1 + 2 * 13, 2, 2 + 13];
            expect(Hand.isFullHouse(cardsIn)).toEqual([1, 1 + 13, 1 + 2 * 13, 2, 2 + 13]);
        });
    });
    describe('isFlush', (): void => {
        it('returns false when no flush in input array', (): void => {
            const cardsIn = [0, 1 + 13, 1 + 2 * 13, 2 + 3 * 13, 3, 4];
            expect(Hand.isFlush(cardsIn)).toEqual(false);
        });
        it('returns included cards sorted by value when flush in input array', (): void => {
            const cardsIn = [0, 1, 2, 4, 5];
            expect(Hand.isFlush(cardsIn)).toEqual([0, 5, 4, 2, 1]);
        });
        it('slices return array to only contain num cards', (): void => {
            const cardsIn = [0, 1, 2, 4, 5];
            expect(Hand.isFlush(cardsIn, 4)).toEqual([0, 5, 4, 2]);
        });
    });
    describe('isStraight', (): void => {
        it('returns false when no straight in input array', (): void => {
            let cardsIn = [0, 1 + 13, 1 + 2 * 13, 2 + 3 * 13, 3, 3 + 13];
            expect(Hand.isStraight(cardsIn)).toEqual(false);
            cardsIn = [0, 1 + 13, 2 + 2 * 13, 3, 5 + 3 * 13];
            expect(Hand.isStraight(cardsIn)).toEqual(false);
        });
        it('returns included cards sorted by value when straight in input array', (): void => {
            let cardsIn = [9, 10, 11, 12, 0];
            expect(Hand.isStraight(cardsIn)).toEqual([0, 12, 11, 10, 9]);
            cardsIn = [14, 15, 16, 17, 18];
            expect(Hand.isStraight(cardsIn)).toEqual([18, 17, 16, 15, 14]);
        });
        it('finds straight with small ace', (): void => {
            const cardsIn = [0, 1 + 13, 2 + 2 * 13, 3, 4 + 3 * 13];
            expect(Hand.isStraight(cardsIn)).toEqual([4 + 3 * 13, 3, 2 + 2 * 13, 1 + 13, 0]);
        });
        it('slices return array to only contain num cards', (): void => {
            const cardsIn = [0, 1, 2, 3, 4, 5];
            expect(Hand.isStraight(cardsIn, 4)).toEqual([5, 4, 3, 2]);
        });
    });
    describe('isTwoPairs', (): void => {
        it('returns false when no two pairs in input array', (): void => {
            const cardsIn = [0, 1 + 13, 1 + 2 * 13, 2 + 3 * 13, 3, 4];
            expect(Hand.isTwoPairs(cardsIn)).toEqual(false);
            cardsIn.push(1);
            expect(Hand.isTwoPairs(cardsIn)).toEqual(false);
        });
        it('returns included cards when two pairs in input array', (): void => {
            const cardsIn = [0, 1 + 13, 1 + 2 * 13, 2, 2 + 13];
            expect(Hand.isTwoPairs(cardsIn)).toEqual([2, 2 + 13, 1 + 13, 1 + 2 * 13]);
        });
    });
});
