/**
 * Created by Viacheslav on 27.11.2016.
 */
import {taskType, questions, typeClass} from '../data/task-type';
import AbstractView from './AbstractView';

class QuestionView extends AbstractView {

  constructor(TaskData) {
    super();
    this.data = TaskData;
  }

  set onUserChoice(handler) {
    this._onUserChoice = handler;
  }

  getMarkup() {
    let tpl = '';
    if (this.data.type === taskType.DOUBLE) {
      for (let i = 0; i < this.data.options.length; i++) {
        tpl += `<div class="game__option">
                  <img src="${this.data.options[i].image}" alt="Option ${i}" width="468" height="458">
                  <label class="game__answer game__answer--photo">
                    <input name="question${i}" type="radio" value="photo">
                    <span>Фотография</span>
                  </label>
                  <label class="game__answer game__answer--paint">
                    <input name="question${i}" type="radio" value="paint">
                    <span>Рисунок</span>
                  </label>
                </div>`;
      }
    } else if (this.data.type === taskType.WIDE) {
      tpl = `<div class="game__option">
                <img src="${this.data.options[0].image}" alt="Option 1" width="705" height="455">
                <label class="game__answer  game__answer--photo">
                  <input name="question0" type="radio" value="photo">
                  <span>Фотография</span>
                </label>
                <label class="game__answer  game__answer--wide  game__answer--paint">
                  <input name="question0" type="radio" value="paint">
                  <span>Рисунок</span>
                </label>
              </div>`;
    } else if (this.data.type === taskType.TRIPLE) {
      for (let i = 0; i < this.data.options.length; i++) {
        tpl += `<div class="game__option">
                   <img src="${this.data.options[i].image}" alt="Option ${i}" width="304" height="455">
                   <input name="question${i}" type="radio" value="paint">
                   </div>`;
      }
    }

    return `
      <p class="game__task">${questions[this.data.type]}</p>
      <form class="game__content  ${typeClass[this.data.type]}">
        ${tpl}
        </div>
      </form>`;
  }

  bindHandlers() {

    const onClick = (evt) => {
      let targetClass = '';

      if (this.element.querySelector('.game__answer')) {
        targetClass = 'game__answer';
      } else {
        targetClass = 'game__option';
      }

      let target = evt.target;
      while (target !== this.element) {
        if (target.classList.contains(targetClass) && isAllQuestionsAnswered()) {
          this._onUserChoice(isAllAnswersCorrect());
          break;
        }
        target = target.parentNode;
      }
    };

    const getAnswers = () => {
      let results = [];
      let form = this.element.querySelector('form');
      for (let i = 0; i < this.data.options.length; i++) {
        results.push(form[`question${i}`].value);
      }
      return results;
    };

    const isAllQuestionsAnswered = () => {
      return getAnswers().every((answer) => answer !== '');
    };

    const isAllAnswersCorrect = () => {
      return getAnswers().every((answer, i) => answer === this.data.options[i].correct);
    };

    this.element.addEventListener('click', onClick);
  }

  addClass() {
    this.element.classList.add('game');
  }
}

export default QuestionView;