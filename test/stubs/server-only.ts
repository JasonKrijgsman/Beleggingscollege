// Lege vervanger voor het pakket "server-only" tijdens tests.
//
// Het echte pakket gooit zodra een client-bundel het importeert — dat is de
// productiebescherming tegen het lekken van cursusinhoud en mag NIET
// verdwijnen. In Vitest is er geen client/server-grens en moet een module als
// @/content gewoon te importeren zijn; vitest.config.mts wijst het pakket
// daarom hierheen.
export {};
