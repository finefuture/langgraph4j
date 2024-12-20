package dev.langchain4j.image_to_diagram.actions;

import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.SystemMessage;
import dev.langchain4j.image_to_diagram.state.Diagram;
import dev.langchain4j.image_to_diagram.ImageToDiagram;
import dev.langchain4j.model.openai.OpenAiChatModel;
import lombok.NonNull;
import org.bsc.langgraph4j.action.NodeAction;

import java.util.Map;

public class TranslateGenericDiagramToPlantUML implements NodeAction<ImageToDiagram.State>  {

    final OpenAiChatModel model;

    public TranslateGenericDiagramToPlantUML( @NonNull OpenAiChatModel model) {
        this.model = model;
    }

    @Override
    public Map<String, Object> apply(ImageToDiagram.State state) throws Exception {
        Diagram.Element diagram = state.diagram()
                .orElseThrow(() -> new IllegalArgumentException("no diagram provided!"));

        dev.langchain4j.model.input.Prompt systemPrompt = ImageToDiagram.loadPromptTemplate( "convert_generic_diagram_to_plantuml.txt" )
                .apply( Map.of( "diagram_description", diagram));

        dev.langchain4j.model.output.Response<AiMessage> response = model.generate( new SystemMessage(systemPrompt.text()) );

        String result = response.content().text();

        return Map.of("diagramCode", result );
    }
}
