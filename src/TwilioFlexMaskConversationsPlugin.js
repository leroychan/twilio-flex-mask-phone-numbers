import React from "react";
import { FlexPlugin } from "@twilio/flex-plugin";

import MaskedMessageBubble from "./components/MaskedMessageBubble/MaskedMessageBubble";

const PLUGIN_NAME = "TwilioFlexMaskConversationsPlugin";

export default class TwilioFlexMaskConversationsPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   */
  async init(flex, manager) {
    const options = { sortOrder: -1 };

    // Mask Phone Number in MessageBubble
    flex.Actions.addListener("beforeAcceptTask", (payload) => {
      if (payload.task.attributes.customerName.startsWith("whatsapp:")) {
        const newName = payload.task.attributes.customerName.replace(
          /.{0,4}$/,
          "****"
        );
        flex.MessagingCanvas.defaultProps.memberDisplayOptions = {
          theirDefaultName: newName,
          theirFriendlyNameOverride: false,
        };
      }
    });

    // Mask entire Second Line in TaskListItem
    flex.TaskListItem.Content.addWrapper((OriginalComponent) => (props) => {
      let newProps = {
        ...props,
      };
      newProps["secondLine"] = "-";
      return <OriginalComponent {...newProps} />;
    });
  }
}
