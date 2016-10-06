# package for kanji window

package GUI::KanjiDetails;

use FormFactory::KanjiVG;
use Model::KanjiReadings;


our $format = <<'_END';
+->-------+-+->--------------+->---------+---------+
^ Image   | ' RTKOfficial    ' MyRTK     ' TagHead |
|         | |                |           |         |
|         | +->--------------+-----------+---------+
|         | ^ RTKStory                   ^ TagList |
|         | |                            |         |
+---------+ |                            +---------+
' JLPT    | |                            ' NewTag  |
+---------+ +----------------------------+---------+
' Jouyou  | ' OtherEnglish                         |
+---------+ +--------------------------------------+
' RTK     | | NoteHead                             |
+---------+ +->------------------------------------+
' Status  | ^ Notes                                |
|         | |                                      |
|         | |                                      |
+---------+-+--------------------------------------+
_END
our $kanjivg_dir = '/home/dec/JLPT_Study/kanjivg/kanjivg-r20160426/kanji';

sub new {
    my $class = shift;
    my %opts = (
	context => undef,
	kanji   => undef,
	toplevel => 0,
	@_,
    );

    my $kanji   = $opts{kanji}   or die "KanjiWindow needs kanji => char option\n";

    # Rethinking how FF works. Why not have a separate context for
    # each KanjiDetails window? 
    
    my $context = $opts{context} or die "KanjiWindow needs context => ref option\n";

    # We want a unique object name for attributes in this window
    my $basename = "gui_kanji_$kanji";

    my $self = bless { context => $context, kanji => $kanji,
		       toplevel => $opts{toplevel},
		       basename => $basename,
		       _kanji => KanjiReadings::Kanji->retrieve($kanji) };


    # GUI attributes; won't use depends since FF won't be synchronous
    $context->add_object(
	name => $basename,
	object => $self,
    );

    $self->build_window;
    $self->{ff}->open;
    $self->{ff}->update_all;

    return $self;
}

sub build_window {

    my $self = shift;
    my $context = $self->{context};
    my $basename = $self->{basename};

    $context->add_object(
	name => "$basename.notes",
	object => $self
    );
    
    # I don't want every keystroke in a notes-type box to trigger a
    # database write, so I'll try setting sync to false on the
    # top-level FormFactory. That way I hope to be able to persist all
    # changes automatically at the same time once the window closes.
    # Since there aren't many interdependent widgets, this shouldn't
    # cause too many problems.

    $self->{ff} = Gtk2::Ex::FormFactory->new(
	sync    => 0,
	context => $context,
	content => [
	    Gtk2::Ex::FormFactory::Window->new(
		label => "Editing Kanji . $self->{kanji}",
		content => [
		    $self->build_table,
		],
		closed_hook => sub {
		    $self->{ff}->ok();
		}
	    )
	]
    );
}

sub get_story {
    "Default story value"
}
sub set_story {
    my $self = shift;
    warn "in get_notes";
    warn "Setting story to $_[0]\n";
    $self->{story} = $_[0];
}

sub get_notes {
    my $self = shift;
    warn "in get_notes";
    $self->{notes};
}
sub set_notes {
    my $self = shift;
    warn "Setting notes to $_[0]\n";
    $self->{notes} = $_[0];
}

sub build_table {
    my $self = shift;
    my $kanji = $self->{kanji};
    my $basename = $self->{basename};
    warn "Basename is $basename\n";
    Gtk2::Ex::FormFactory::Table->new(
	expand => 1,
	layout => $format,
	content => [
	    $self->build_kanjivg_image,
	    Gtk2::Ex::FormFactory::Label->new(label => "RTK Official"),
	    Gtk2::Ex::FormFactory::Label->new(label => "My RTK"),
	    Gtk2::Ex::FormFactory::Label->new(label => "Tags"),
	    Gtk2::Ex::FormFactory::TextView->new(attr => "$basename.story"),
	    Gtk2::Ex::FormFactory::Label->new(label => "Tag List"),
	    Gtk2::Ex::FormFactory::Label->new(label => "JLPT"),
	    Gtk2::Ex::FormFactory::Label->new(label => "New Tag"),
	    Gtk2::Ex::FormFactory::Label->new(label => "Jouyou"),
	    Gtk2::Ex::FormFactory::Label->new(label => "Other English"),
	    Gtk2::Ex::FormFactory::Label->new(label => "RTK"),
	    Gtk2::Ex::FormFactory::Label->new(label => "Enter kanji notes below"),
	    Gtk2::Ex::FormFactory::Label->new(label => "Status"),
	    Gtk2::Ex::FormFactory::TextView->new(attr => "$basename.notes"),
	]
    );
}

sub 

sub get_kanji_file {
    my $self = shift;
    my $kanji = $self->{kanji};
    warn "Asked to get image file, kanji is $kanji\n";
    my $unicode = sprintf("%05x", ord $kanji);

    my $filename = "$kanjivg_dir/$unicode.svg";
    return $filename;
}

sub build_kanjivg_image {
    my $self = shift;
    my $basename = $self->{basename};
    Gtk2::Ex::FormFactory::Image->new(
	attr => "$basename.kanji_file",
	bgcolor => "#ffffff",
	scale_to_fit => 1,
    );
}