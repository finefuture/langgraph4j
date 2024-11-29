package org.bsc.langgraph4j.diagram;

import org.bsc.langgraph4j.DiagramGenerator;

import static java.lang.String.format;
import static org.bsc.langgraph4j.StateGraph.END;
import static org.bsc.langgraph4j.StateGraph.START;

/**
 * This class represents a MermaidGenerator that extends DiagramGenerator. It generates a flowchart using Mermaid syntax.
 * The flowchart includes various nodes such as start, stop, web_search, retrieve, grade_documents, generate, transform_query,
 * and different conditional states.
 */
public class MermaidGenerator extends DiagramGenerator {

    @Override
    protected void appendHeader( Context ctx ) {
        if( ctx.isSubgraph() ) {
            ctx.sb()
                .append(format("subgraph %s\n", ctx.title()))
                .append(format("\t#%s@{ shape: start, label: \"enter\" }\n", START))
                .append(format("\t#%s@{ shape: stop, label: \"exit\" }\n", END))
                ;
        }
        else {
            ctx.sb()
                .append(format("---\ntitle: %s\n---\n", ctx.title()))
                .append("flowchart TD\n")
                .append(format("\t%s((start))\n", START))
                .append(format("\t%s((stop))\n", END))
                ;
        }
    }

    @Override
    protected void appendFooter(Context ctx) {
        if( ctx.isSubgraph() ) {
            ctx.sb().append("end\n");
        }
    }

   @Override
   protected void declareConditionalStart(Context ctx, String name) {
       ctx.sb().append('\t');
       if( ctx.isSubgraph() ) ctx.sb().append('#');
       ctx.sb().append( format("%s{\"check state\"}\n", name) );
   }

   @Override
   protected void declareNode(Context ctx, String name) {
       ctx.sb().append('\t');
       if( ctx.isSubgraph() ) ctx.sb().append('#');
       ctx.sb().append( format( "%s(\"%s\")\n", name, name ) );
   }

   @Override
   protected void declareConditionalEdge(Context ctx, int ordinal) {
       ctx.sb().append('\t');
       if( ctx.isSubgraph() ) ctx.sb().append('#');
       ctx.sb().append( format("condition%d{\"check state\"}\n", ordinal) );
   }

    @Override
    protected void commentLine(Context ctx, boolean yesOrNo) {
        if (yesOrNo) ctx.sb().append( "\t%%" );
    }

    @Override
    protected void call(Context ctx, String from, String to) {
        ctx.sb().append('\t');
        if( ctx.isSubgraph() ) {
            ctx.sb().append( format("#%1$s:::%1$s --> #%2$s:::%2$s\n", from, to) );
        }
        else {
            ctx.sb().append( format("%1$s:::%1$s --> %2$s:::%2$s\n", from, to) );
        }
    }

    @Override
    protected void call(Context ctx, String from, String to, String description) {
        ctx.sb().append('\t');
        if( ctx.isSubgraph() ) {
            ctx.sb().append(format("#%1$s:::%1$s -->|%2$s| #%3$s:::%3$s\n", from, description, to));
        }
        else {
            ctx.sb().append(format("%1$s:::%1$s -->|%2$s| %3$s:::%3$s\n", from, description, to));
        }

    }
}
