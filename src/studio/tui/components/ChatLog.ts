import { Container, Spacer, Text } from "@mariozechner/pi-tui";
import { theme } from "../theme";

class UserMessageComponent extends Container {
  private childText: Text;
  constructor(text: string) {
    super();
    this.addChild(new Spacer(1));
    this.childText = new Text(theme.userText(theme.userBg(` ${text} `)), 1, 0);
    this.addChild(this.childText);
  }
  setText(text: string) {
    this.childText.setText(theme.userText(theme.userBg(` ${text} `)));
  }
}

class AssistantMessageComponent extends Container {
  private childText: Text;
  constructor(text: string) {
    super();
    this.addChild(new Spacer(1));
    this.childText = new Text(theme.assistantText(text), 1, 0);
    this.addChild(this.childText);
  }
  setText(text: string) {
    this.childText.setText(theme.assistantText(text));
  }
}

export class ChatLog extends Container {
  private readonly maxComponents: number;
  private messageMap = new Map<string, Container>();

  constructor(maxComponents = 180) {
    super();
    this.maxComponents = Math.max(20, Math.floor(maxComponents));
  }

  private pruneOverflow() {
    while (this.children.length > this.maxComponents) {
      const oldest = this.children[0];
      if (!oldest) return;
      this.removeChild(oldest);
    }
  }

  private append(component: Container) {
    this.addChild(component);
    this.pruneOverflow();
  }

  addSystem(text: string) {
    const entry = new Container();
    entry.addChild(new Spacer(1));
    entry.addChild(new Text(theme.system(text), 1, 0));
    this.append(entry);
  }

  addUser(text: string): string {
    const id = Date.now().toString() + Math.random();
    const comp = new UserMessageComponent(text);
    this.messageMap.set(id, comp);
    this.append(comp);
    return id;
  }

  addAssistant(text: string): string {
    const id = Date.now().toString() + Math.random();
    const comp = new AssistantMessageComponent(text);
    this.messageMap.set(id, comp);
    this.append(comp);
    return id;
  }

  updateAssistant(id: string, text: string) {
    const existing = this.messageMap.get(id);
    if (existing instanceof AssistantMessageComponent) {
      existing.setText(text);
    }
  }
}
