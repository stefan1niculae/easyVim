// /**
//  * Created by Razvan on 4/10/2016.
//  */
//
// const Lesson = require('../models/lesson.js');
// const lessons = [];
// const _ = require('lodash');
//
// function insertLesson(title, description, startingContent, cheats, completed, progress, type) {
//
//     lessons.push({
//         title: title,
//         description: description,
//         startingContent: startingContent,
//         cheats: cheats,
//         completed: completed,
//         progress: progress,
//         type: type
//     });
// }
//
// const generator = function() {
//
//     insertLesson(
//         "Basic movement",
//         "In the first lesson you will learn the basic movements in VIM",
//         "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
//         [
//             {section: "basic movement", shortcut: "h", description: "left one character", keycodes: [104], finished: false},
//             {section: "basic movement", shortcut: "j", description: "right one character", keycodes: [106], finished: false},
//             {section: "basic movement", shortcut: "k", description: "down one row", keycodes: [107], finished: false},
//             {section: "basic movement", shortcut: "l", description: "up one row", keycodes: [108], finished: false}
//         ],
//         false,
//         0,
//         "navigation");
//
//     insertLesson(
//         "Word movement",
//         "In the second lesson you will learn the basic word movements in VIM",
//         "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
//         [
//             {section: "word movement", shortcut: "w", description: "left one character", keycodes: [119], finished: false},
//             {section: "word movement", shortcut: "b", description: "right one character", keycodes: [98], finished: false},
//             {section: "word movement", shortcut: "e", description: "down one row", keycodes: [101], finished: false}
//         ],
//         false,
//         0,
//         "navigation");
//
//     console.log('Lessons: ', lessons);
//     _.forEach(lessons, function (elem) {
//         new Lesson(elem).save(function (err, elem) {
//             console.log('elem', elem);
//         })
//     })
// };
//
// module.exports = generator;